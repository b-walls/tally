import logging
import base64
from datetime import datetime

from PIL import Image

from ninja import Router, Status, File
from ninja.files import UploadedFile
from api.auth import SessionAuth

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponseForbidden

from openai import AsyncOpenAI, OpenAIError
from dotenv import load_dotenv
from asgiref.sync import sync_to_async

from api.models import Category, CATEGORY_CHOICES, Receipt, ReceiptItem
from api.schema import Message, ScanResponse, ReceiptSchema, ReceiptItemSchema, UpdateReceiptItemSchema, UpdateReceiptSchema

logger = logging.getLogger(__name__)

load_dotenv()
client = AsyncOpenAI()

receipt_router = Router(auth=SessionAuth())


async def scan_request(categories: list[str], base64_img: str) -> ScanResponse:
    response = await client.responses.parse(
            model="gpt-4.1",
            input=[
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "input_text",
                            "text": (
                                "You extract structured data from receipt images. "
                                "Identify the merchant name, purchase date, total amount, and each line item with its name, price, and best-fit category. "
                                "Use only information visible in the receipt. "
                                "Do not guess missing values. If a field cannot be read, return an empty string for text fields, 0 for numeric fields, and omit unreadable items. "
                                "Normalize the date into YYYY-MM-DD when possible and return prices as numbers without currency symbols. "
                                f"Each item category must be one of: {', '.join(categories)}. "
                                "If none fit, use 'Other'."
                                "For sales tax label it as the category most apparent in the transaction and treat it as a line item"
                                "Return data that matches the provided schema exactly."
                            ),
                        }
                    ],
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": "Extract the receipt data from this image and return the structured result.",
                        },
                        {
                            "type": "input_image",
                            "image_url": f"data:image/jpeg;base64,{base64_img}",
                        },
                    ],
                }
            ],
            text_format=ScanResponse
        )
    return response.output_parsed


def parse_receipt_date(date_str: str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except (TypeError, ValueError):
        return None


@receipt_router.post("/scan", response={200: ReceiptSchema, 400: Message, 422: Message, 502: Message, 500: Message})
async def scan(request, file: File[UploadedFile]):
    base64_img = base64.b64encode(file.read()).decode("utf-8")

    user = request.user
    categories = await sync_to_async(list)(Category.objects.filter(user=user))
    categories_str = set([category.name for category in categories])

    if len(categories_str) < len(CATEGORY_CHOICES):
        for cat in CATEGORY_CHOICES:
            categories_str.add(cat)

    try:
        pil_img = Image.open(file)

        if pil_img.format not in {"JPEG", "PNG"}:
            raise SyntaxError

        pil_img.verify()
    except (IOError, SyntaxError) as e:
        logger.error(f"Image verification error: {e}")
        return Status(400, {'message': 'Invalid or unreadable image'})

    try:
        scanned_receipt = await scan_request(categories_str, base64_img)
    except OpenAIError as e:
        logger.error(f"OpenAI scan error: {e}")
        return Status(502, {'message': 'Receipt scanning service unavailable'})

    if scanned_receipt is None:
        return Status(422, {'message': 'Could not extract receipt data'})

    try:
        receipt = await sync_to_async(Receipt.objects.create)(user=user,
                                        image=file,
                                        merchant=scanned_receipt.merchant,
                                        date=parse_receipt_date(scanned_receipt.date),
                                        total=scanned_receipt.total)

        receipt_item_schemas = []
        for item in scanned_receipt.items:
            category = await sync_to_async(list)(Category.objects.filter(user=user, name=item.category))

            if len(category) == 0:
                category = await sync_to_async(Category.objects.get)(user=user, name="Other")
            else:
                category = category[0]

            receipt_item = await sync_to_async(ReceiptItem.objects.create)(receipt=receipt,
                                                                           category=category,
                                                                           name=item.name,
                                                                           amount=item.amount)
            receipt_item_schemas.append(ReceiptItemSchema(name=item.name,
                                                          category=category.name,
                                                          amount=item.amount,
                                                          confirmed=False,
                                                          id=receipt_item.id))

        receipt_schema = ReceiptSchema(merhcant=receipt.merchant,
                            date=receipt.date.strftime("%Y-%m-%d"),
                            total=receipt.total,
                            created_at=receipt.created_at.strftime("%Y-%m-%d"),
                            items=receipt_item_schemas,
                            id=receipt.id)

    except Exception as e:
        logger.error(f"Registration error: {e}")
        return Status(500, {'message': 'An unexpected error occurred'})

    return Status(200, receipt_schema)


@receipt_router.get("/{id}/image")
def get_receipt_image(request, id: int):
    """gets the image for a receipt"""
    user = request.user
    receipt = get_object_or_404(Receipt, id=id)

    if not (receipt.user.id == user.id or user.is_superuser):
        return HttpResponseForbidden

    pil_image = Image.open(receipt.image)
    format = pil_image.format.lower()
    pil_image.close()

    return FileResponse(receipt.image.open(), content_type=f"image/{format}")


@receipt_router.get("/{id}", response={200: ReceiptSchema, 403: Message})
def receipt_detail(request, id: int):
    """gets a receipt by id (including items)"""
    user = request.user
    receipt = get_object_or_404(Receipt, id=id)

    if not (receipt.user.id == user.id or user.is_superuser):
        return Status(403, "Forbidden")

    items = ReceiptItem.objects.filter(receipt=receipt)
    receipt_items = []
    for item in items:
        receipt_items.append(ReceiptItemSchema(name=item.name,
                                         category=item.category.name,
                                         amount=item.amount,
                                         confirmed=item.confirmed,
                                         id=item.id))

    receipt = ReceiptSchema(merhcant=receipt.merchant,
                            date=receipt.date.strftime("%Y-%m-%d"),
                            total=receipt.total,
                            created_at=receipt.created_at.strftime("%Y-%m-%d"),
                            items=receipt_items,
                            id=id)

    return Status(200, receipt)

@receipt_router.patch("/{id}", response={200: ReceiptSchema, 403: Message, 422: Message})
def update_receipt(request, id: int, payload: UpdateReceiptSchema):
    """update a receipt by id"""
    user = request.user
    receipt = get_object_or_404(Receipt, id=id)

    if not (receipt.user.id == user.id or user.is_superuser):
        return Status(403, "Forbidden")

    if payload.merchant is not None:
        receipt.merchant = payload.merchant

    if payload.date is not None:
        receipt.date = parse_receipt_date(payload.date)
        if receipt.date == None:
            return Status(422, {"message": "Unprocessable input"})

    if payload.total is not None:
        receipt.total = payload.total
    
    receipt.save()
    items = ReceiptItem.objects.filter(receipt=receipt)
    receipt_items = []
    for item in items:
        receipt_items.append(ReceiptItemSchema(name=item.name,
                                         category=item.category.name,
                                         amount=item.amount,
                                         confirmed=item.confirmed,
                                         id=item.id))

    receipt = ReceiptSchema(merhcant=receipt.merchant,
                            date=receipt.date.strftime("%Y-%m-%d"),
                            total=receipt.total,
                            created_at=receipt.created_at.strftime("%Y-%m-%d"),
                            items=receipt_items,
                            id=id)

    return Status(200, receipt)

@receipt_router.patch("/items/{id}", response={200: Message, 403: Message, 400: Message})
def update_receipt_item(request, id: int, payload: UpdateReceiptItemSchema):
    receipt_item = get_object_or_404(ReceiptItem, id=id)

    if not (request.user == receipt_item.receipt.user or request.user.is_superuser):
        return Status(403, {"message": "Forbidden."})

    user = request.user

    if user.is_superuser and payload.username is not None:
        user = User.objects.get(username=payload.username)

    if payload.category is not None:
        category_str = payload.category

        try:
            category = Category.objects.get(name=category_str, user=request.user)
        except Category.DoesNotExist:
            return Status(400, {"message": "Category does not exist."})
        except Category.MultipleObjectsReturned:
            return Status(400, {"message": "Multiple categories of the same name found."})

        receipt_item.category = category

    if payload.amount is not None:
        receipt_item.amount = payload.amount

    if payload.name is not None:
        receipt_item.name = payload.name

    if payload.confirmed is not None:
        receipt_item.confirmed = payload.confirmed

    receipt_item.save()
    return Status(200, {"message": "receipt item updated"})
