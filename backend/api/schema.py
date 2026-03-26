from decimal import Decimal
from typing import Optional

from pydantic import EmailStr
from ninja import Schema, ModelSchema
from django.contrib.auth.models import User

from api.models import Budget, Category, Receipt, ReceiptItem


class Message(Schema):
    message: str


class RegisterSchema(Schema):
    first_name: str
    last_name: str
    password: str
    email: EmailStr


class LoginSchema(Schema):
    username: str
    password: str


class ScanItem(Schema):
    category: str
    name: str
    amount: Decimal


class ScanResponse(Schema):
    merchant: str
    date: str  # raw string from AI — parsed later via parse_receipt_date
    total: Decimal
    items: list[ScanItem]


class ReceiptItemSchema(ModelSchema):
    category: str

    class Meta:
        model = ReceiptItem
        fields = ['id', 'name', 'amount', 'confirmed']

    @staticmethod
    def resolve_category(obj) -> str:
        return obj.category.name


class ReceiptSchema(ModelSchema):
    items: list[ReceiptItemSchema]

    class Meta:
        model = Receipt
        fields = ['id', 'merchant', 'date', 'total', 'created_at']

    @staticmethod
    def resolve_items(obj) -> list:
        return obj.receiptitem_set.all()


class UpdateReceiptSchema(Schema):
    merchant: Optional[str] = None
    date: Optional[str] = None  # string kept to allow parse_receipt_date validation in router
    total: Optional[Decimal] = None


class UpdateReceiptItemSchema(Schema):
    username: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[Decimal] = None
    name: Optional[str] = None
    confirmed: Optional[bool] = None


class BudgetRemainingSchema(Schema):
    id: int
    category: str
    limit: Decimal
    remaining: Decimal


class GetBudgetSchema(ModelSchema):
    category: str

    class Meta:
        model = Budget
        fields = ['id', 'limit']

    @staticmethod
    def resolve_category(obj) -> str:
        return obj.category.name


class UpdateBudgetSchema(Schema):
    limit: Decimal


class CategorySchema(ModelSchema):
    category: str

    class Meta:
        model = Category
        fields = ['id']

    @staticmethod
    def resolve_category(obj) -> str:
        return obj.name


class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']
