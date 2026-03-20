from pydantic import EmailStr
from pydantic import BaseModel
from ninja import Schema

class Message(Schema):
    message: str

class RegisterSchema(Schema):
    first_name: str
    last_name: str
    username: str
    password: str
    email: EmailStr

class ScanItem(BaseModel):
    category: str
    name: str
    amount: float

class ScanResponse(BaseModel):
    merchant: str
    date: str
    total: float
    items: list[ScanItem]

class ReceiptItemSchema(Schema): 
    id: int
    name: str
    category: str
    amount: float
    confirmed: bool
    
class ReceiptSchema(Schema):
    id: int
    merhcant: str
    date: str
    total: float
    created_at: str
    items: list[ReceiptItemSchema]
    
class UpdateReceiptSchema(Schema):
    username: str = None
    category: str = None
    amount: float = None
    name: str = None
    confirmed: bool = None

class BudgetRemainingSchema(Schema):
    id: int
    category: str
    limit: float
    month: str
    remaining: float = None


class BudgetSchema(Schema):
    id: int
    category: str
    limit: float
    month: str

class CategorySchema(Schema):
    id: int
    category: str