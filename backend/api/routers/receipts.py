import logging
import base64
from collections import defaultdict
from datetime import datetime, date

from PIL import Image

from ninja import Router, Status, File
from ninja.files import UploadedFile
from api.auth import SessionAuth

from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponseForbidden

from openai import AsyncOpenAI, OpenAIError
from dotenv import load_dotenv
from asgiref.sync import sync_to_async

from api.models import Category, CATEGORY_CHOICES, Expense, Receipt
from api.schema import Message, ScanResponse, ReceiptSchema, ScanResultSchema, ExpenseMixSchema

logger = logging.getLogger(__name__)

load_dotenv()
client = AsyncOpenAI()

receipt_router = Router()


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


@receipt_router.post("/scan", response={200: ScanResultSchema, 400: Message, 422: Message, 502: Message, 500: Message})
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
        receipt = await sync_to_async(Receipt.objects.create)(user=user, image=file)

        groups = defaultdict(float)
        for item in scanned_receipt.items:
            groups[item.category] += item.amount

        receipt_date = parse_receipt_date(scanned_receipt.date) or date.today()
        created_expenses = []

        for category_name, total in groups.items():
            category = await sync_to_async(
                Category.objects.filter(user=user, name=category_name).first
            )()
            if category is None:
                category = await sync_to_async(Category.objects.get)(user=user, name="Other")

            expense = await sync_to_async(Expense.objects.create)(
                user=user,
                receipt=receipt,
                merchant=scanned_receipt.merchant,
                category=category,
                date=receipt_date,
                total=round(total, 2),
            )
            created_expenses.append(
                ExpenseMixSchema(id=expense.id, merchant=expense.merchant, total=float(expense.total),
                                 date=expense.date, category=category.name, receipt_id=receipt.id)
            )

    except Exception as e:
        logger.error(f"Scan error: {e}")
        return Status(500, {'message': 'An unexpected error occurred'})

    return Status(200, ScanResultSchema(receipt_id=receipt.id, expenses=created_expenses))


@receipt_router.get("/{id}/image")
def get_receipt_image(request, id: int):
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
    user = request.user
    receipt = get_object_or_404(Receipt, id=id)

    if not (receipt.user.id == user.id or user.is_superuser):
        return Status(403, "Forbidden")

    schema = ReceiptSchema.from_orm(receipt)
    schema.expenses = [
        ExpenseMixSchema(id=e.id, merchant=e.merchant, total=float(e.total),
                         date=e.date, category=e.category.name, receipt_id=receipt.id)
        for e in receipt.expense_set.select_related('category')
    ]
    return Status(200, schema)
