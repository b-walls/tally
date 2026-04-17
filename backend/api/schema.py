from typing import Optional
from pydantic import EmailStr, BaseModel
from ninja import Schema, ModelSchema
from django.contrib.auth.models import User
from datetime import date

from api.models import Category, Expense, Receipt, Budget


class Message(Schema):
    message: str

# ------- Auth ----------
class RegisterSchema(Schema):
    first_name: str
    last_name: str
    password: str
    email: EmailStr


class LoginSchema(Schema):
    username: str
    password: str

class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name']

# ------- Scanning ----------
class ScanItem(BaseModel):
    category: str
    name: str
    amount: float


class ScanResponse(BaseModel):
    merchant: str
    date: str
    total: float
    items: list[ScanItem]


# ------- Category ----------
class CategorySchema(ModelSchema):
    class Meta:
        model = Category
        fields = ["id", "name", "color", "icon"]


# ------- Expense ----------
class ExpenseMixSchema(Schema):
    id: int
    merchant: str
    total: float
    date: date
    category: CategorySchema
    receipt_id: Optional[int] = None


class ExpenseSchema(ModelSchema):
    category: str
    receipt_id: Optional[int] = None

    @staticmethod
    def resolve_category(obj):
        return obj.category.name

    @staticmethod
    def resolve_receipt_id(obj):
        return obj.receipt_id

    class Meta:
        model = Expense
        fields = ['id', 'merchant', 'date', 'total', 'note']


# ------- Receipts ----------
class ReceiptSchema(ModelSchema):
    expenses: list[ExpenseMixSchema] = []

    class Meta:
        model = Receipt
        fields = ['id', 'created_at']


class ScanResultSchema(Schema):
    receipt_id: int
    expenses: list[ExpenseMixSchema]


# ------- Budget ----------
class GetBudgetSchema(ModelSchema):
    category: str

    @staticmethod
    def resolve_category(obj):
        return obj.category.name

    class Meta:
        model = Budget
        fields = ['id', 'limit', 'period']


class BudgetRemainingSchema(Schema):
    id: int
    category: str
    limit: float
    remaining: float
    spent: float
    period: str


class UpdateBudgetSchema(Schema):
    limit: float
    period: str
