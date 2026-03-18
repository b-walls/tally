from django.contrib import admin
from .models import Receipt, ReceiptItem, Budget, Category

# Register your models here.
admin.site.register([Receipt, ReceiptItem, Budget, Category])