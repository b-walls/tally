from django.contrib import admin
from .models import Receipt, Budget, Category, Expense

# Register your models here.
admin.site.register([Receipt, Budget, Category, Expense])