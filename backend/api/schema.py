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
        fields = ['id', 'name']


# ------- Receipts ----------

class ReceiptItemSchema(Schema):
    id: int
    name: str
    category: str
    amount: float
    confirmed: bool


class ReceiptSchema(ModelSchema):
    items: list['ReceiptItemSchema'] = []

    class Meta:
        model = Receipt
        fields = ['id', 'merchant', 'date', 'total', 'created_at']


class UpdateReceiptSchema(Schema):
    merchant: Optional[str] = None
    date: Optional[str] = None
    total: Optional[float] = None


class UpdateReceiptItemSchema(Schema):
    username: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    name: Optional[str] = None
    confirmed: Optional[bool] = None

# ------- Budget ----------
class GetBudgetSchema(ModelSchema):
    category: str

    @staticmethod
    def resolve_category(obj):
        return obj.category.name

    class Meta:
        model = Budget
        fields = ['id', 'limit']


class BudgetRemainingSchema(Schema):
    id: int
    category: str
    limit: float
    remaining: float


class UpdateBudgetSchema(Schema):
    limit: float


# ------- Expense ----------
class ExpenseSchema(ModelSchema):
    category: str

    @staticmethod
    def resolve_category(obj):
        return obj.category.name

    class Meta:
        model = Expense
        fields = ['id', 'merchant', 'date', 'total', 'note']

class ExpenseMixSchema(Schema):
    type: str
    id: int
    merchant: str
    total: float
    date: date
    category: str

# retired
# class ExpenseRange(Schema):
#     receipts: list[ReceiptSchema]
#     expenses: list[ExpenseSchema]
