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

ICON_CHOICES = [
    ("shopping-cart", "Shopping Cart"),
    ("utensils", "Utensils"),
    ("car", "Car"),
    ("home", "Home"),
    ("heart", "Heart"),
    ("gamepad-2", "Gamepad"),
    ("shirt", "Shirt"),
    ("dumbbell", "Dumbbell"),
    ("plane", "Plane"),
    ("coffee", "Coffee"),
    ("book-open", "Book"),
    ("music", "Music"),
    ("gift", "Gift"),
    ("dog", "Dog"),
    ("scissors", "Scissors"),
    ("briefcase", "Briefcase"),
    ("graduation-cap", "Graduation Cap"),
    ("pill", "Pill"),
    ("wrench", "Wrench"),
    ("wifi", "Wifi"),
    ("baby", "Baby"),
    ("fuel", "Fuel"),
    ("circle-parking", "Parking"),
    ("bus", "Bus"),
    ("bike", "Bike"),
    ("tv", "TV"),
    ("smartphone", "Smartphone"),
    ("receipt", "Receipt"),
    ("landmark", "Landmark"),
    ("tag", "Tag"),
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
    color = models.CharField(max_length=7, default="#ffffff")
    icon = models.CharField(max_length=50, choices=ICON_CHOICES, default="tag")

    def __str__(self):
        return f"{self.user.username}: {self.name}"

class Receipt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="receipts/")
    created_at = models.DateTimeField(auto_now_add=True)
        
    def __str__(self):
        return f"{self.user.username} | {self.id}"

    class Meta:
        indexes = [
            models.Index(fields=['user']),
        ]

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE, null=True, blank=True, default=None)
    merchant = models.CharField(max_length=50, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    date = models.DateField()
    total = models.DecimalField(max_digits=8, decimal_places=2)
    note = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.user.username} expense: {self.merchant} ${self.total}"
    
    class Meta:
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['user', 'date']),
        ]

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    limit = models.DecimalField(max_digits=8, decimal_places=2)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default="monthly")

    def __str__(self):
        return f"{self.category.name} for {self.user.username}"
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'category'], 
                name='unique_budget_category_month '
            )
        ]
