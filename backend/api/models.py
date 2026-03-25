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

PERIOD_CHOICES = [
    ("weekly", "Weekly"),
    ("monthly", "Monthly"),
]

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    budget_period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default="weekly")

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
    
        
    def __str__(self):
        return f"{self.user.username} | {self.id}"

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['user', 'date']),
        ]

class ReceiptItem(models.Model):
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    confirmed = models.BooleanField(default=False)
     
    def __str__(self):
        return f"Item for receipt {self.receipt.id}"
    class Meta:
        indexes = [
            models.Index(fields=['category']),
        ]

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    merchant = models.CharField(max_length=50, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    date = models.DateField()
    total = models.DecimalField(max_digits=8, decimal_places=2)
    note = models.TextField()
    
    def __str__(self):
        return f"{self.user.username} expense: {self.merchant} ${self.total}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    limit = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.category.name} for {self.user.username}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'category'], 
                name='unique_budget_category_month '
            )
        ]
