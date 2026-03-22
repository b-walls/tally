import logging
from collections import defaultdict
from datetime import date, timedelta

from ninja import Router, Status
from api.auth import CookieAuth

from django.contrib.auth.models import User

from api.models import ReceiptItem, Budget, CustomUser, Category
from api.schema import GetBudgetSchema, BudgetRemainingSchema, UpdateBudgetSchema, Message

logger = logging.getLogger(__name__)

budget_router = Router(auth=CookieAuth())


@budget_router.get("/remaining", response={200: list[BudgetRemainingSchema]})
def get_remaining_budget(request, username: str | None = None):
    user = request.user

    if user.is_superuser and username is not None:
        user = User.objects.get(username=username)

    today = date.today()

    # find receipts for the current period
    period = CustomUser.objects.get(user=user).budget_period
    if period == "weekly":
        start_date = today - timedelta(days=(today.weekday() + 1) % 7)
        end_date = start_date + timedelta(days=6)
        receipt_items = ReceiptItem.objects.filter(receipt__user=user,
                                                   receipt__date__range=(start_date, end_date))
    else:
        receipt_items = ReceiptItem.objects.filter(receipt__user=user,
                                                   receipt__date__month=today.month,
                                                   receipt__date__year=today.year)

    budgets = Budget.objects.filter(user=user)

    category_spending = defaultdict(int)
    for item in receipt_items:
        category_spending[item.category.name] += item.amount

    results = []
    print(category_spending)
    for budget in budgets:
        curr_category = budget.category.name
        remaining = budget.limit - category_spending[curr_category]
        results.append(BudgetRemainingSchema(id=budget.id,
                                       category=curr_category,
                                       limit=budget.limit,
                                       remaining=remaining))

    return Status(200, results)


@budget_router.get("/", response={200: list[GetBudgetSchema]})
def get_budgets(request, username: str | None = None):
    user = request.user

    if user.is_superuser and username is not None:
        user = User.objects.get(username=username)
    
    budgets = Budget.objects.filter(user=user)
    
    results = []
    for budget in budgets:
        results.append(GetBudgetSchema(id=budget.id,
                                    category=budget.category.name,
                                    limit=budget.limit))    
    return Status(200, results)


@budget_router.patch("/{id}", response={200: GetBudgetSchema, 403: Message})
def update_budget(request, id: int, payload: UpdateBudgetSchema):
    user = request.user
    budget = Budget.objects.get(id=id)

    if not (budget.user == user or user.is_superuser):
        return Status(403, "Unauthorized")

    budget.limit = payload.limit
    budget.save()

    return Status(200, GetBudgetSchema(id=budget.id, category=budget.category.name, limit=budget.limit))