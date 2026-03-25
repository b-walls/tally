from django.contrib import admin
from .models import Receipt, ReceiptItem, Budget, Category, Expense

# Register your models here.
admin.site.register([Receipt, ReceiptItem, Budget, Category, Expense])