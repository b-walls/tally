from django.db import models
from django.contrib.auth.models import User

CATEGORY_CHOICES = [
    'Groceries',
    'Dining',
    'Transport',
    'Shopping',
    'Health',
    'Entertainment',
    'Other',
]

class Category(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}: {self.name}"

class Receipt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="receipts/")
    merchant = models.CharField(max_length=50, blank=True)
    date = models.DateField(null=True)
    total = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['user', 'date']),
        ]
    
    def __str__(self):
        return f"{self.user.username} | {self.id}"

class ReceiptItem(models.Model):
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    confirmed = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            models.Index(fields=['category']),
        ]
    
    def __str__(self):
        return f"Item for receipt {self.receipt.id}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    spent = models.DecimalField(max_digits=8, decimal_places=2)
    limit = models.DecimalField(max_digits=8, decimal_places=2)
    month = models.DateField(auto_now=False, auto_now_add=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'category', 'month'], 
                name='unique_budget_category_month '
            )
        ]
