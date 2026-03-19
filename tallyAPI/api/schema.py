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