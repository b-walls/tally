import logging
from collections import defaultdict
from datetime import date, timedelta

from ninja import Router, Status
from api.auth import SessionAuth

from django.contrib.auth.models import User

from api.models import ReceiptItem, Budget, UserSettings, Category, Expense
from api.schema import GetBudgetSchema, BudgetRemainingSchema, UpdateBudgetSchema, Message

logger = logging.getLogger(__name__)

budget_router = Router(auth=SessionAuth())


@budget_router.get("/remaining", response={200: list[BudgetRemainingSchema]})
def get_remaining_budget(request, username: str | None = None):
    """Gets the remaining balance on each budget for a user"""
    user = request.user

    if user.is_superuser and username is not None:
        user = User.objects.get(username=username)

    today = date.today()

    receipt_items = ReceiptItem.objects.filter(receipt__user=user,
                                               receipt__date__month=today.month,
                                               receipt__date__year=today.year).select_related('category')
    expenses = Expense.objects.filter(user=user,
                                      date__month=today.month,
                                      date__year=today.year).select_related('category')

    budgets = Budget.objects.filter(user=user).select_related('category')

    category_spending = defaultdict(int)
    for item in receipt_items:
        category_spending[item.category.name] += item.amount
    
    for item in expenses:
        category_spending[item.category.name] += item.total

    results = []
    for budget in budgets:
        curr_category = budget.category.name
        remaining = budget.limit - category_spending[curr_category]
        results.append(BudgetRemainingSchema(id=budget.id,
                                             category=curr_category,
                                             limit=float(budget.limit),
                                             remaining=float(remaining)))

    return Status(200, results)


@budget_router.get("/", response={200: list[GetBudgetSchema]})
def get_budgets(request, username: str | None = None):
    """Gets all budgets for a user"""
    user = request.user

    if user.is_superuser and username is not None:
        user = User.objects.get(username=username)
    
    budgets = Budget.objects.filter(user=user).select_related('category')

    return Status(200, list(budgets))


@budget_router.patch("/{id}", response={200: GetBudgetSchema, 403: Message})
def update_budget(request, id: int, payload: UpdateBudgetSchema):
    """Gets a budget by id"""
    user = request.user
    budget = Budget.objects.get(id=id)

    if not (budget.user == user or user.is_superuser):
        return Status(403, "Unauthorized")

    budget.limit = payload.limit
    budget.save()

    return Status(200, budget)