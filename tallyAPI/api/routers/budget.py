import logging
from collections import defaultdict
from datetime import date

from ninja import Router, Status
from ninja_jwt.authentication import JWTAuth

from django.contrib.auth.models import User

from api.models import ReceiptItem, Budget
from api.schema import BudgetSchema, BudgetRemainingSchema

logger = logging.getLogger(__name__)

budget_router = Router(auth=JWTAuth())


@budget_router.get("/remaining", response={200: list[BudgetRemainingSchema]})
def get_remaining_budget(request, username: str | None = None):
    user = request.user

    if user.is_superuser and username is not None:
        user = User.objects.get(username=username)

    today = date.today()

    receipt_items = ReceiptItem.objects.filter(receipt__user=user,
                                              receipt__date__month=today.month,
                                              receipt__date__year=today.year)

    budgets = Budget.objects.filter(user=user,
                                    month__month=today.month,
                                    month__year=today.year)

    category_spending = defaultdict(int)
    for item in receipt_items:
        category_spending[item.category.name] += item.amount

    results = []
    for budget in budgets:
        curr_category = budget.category.name
        remaining = budget.limit - category_spending[curr_category]
        results.append(BudgetRemainingSchema(id=budget.id,
                                       category=curr_category,
                                       limit=budget.limit,
                                       month=budget.month.strftime("%Y-%m-%d"),
                                       remaining=remaining))

    return Status(200, results)


@budget_router.get("/", response={200: list[BudgetSchema]})
def get_budgets(request, username: str | None = None):
    user = request.user

    if user.is_superuser and username is not None:
        user = User.objects.get(username=username)
    
    budgets = Budget.objects.filter(user=user)
    
    results = []
    for budget in budgets:
        results.append(BudgetSchema(id=budget.id,
                                    category=budget.category.name,
                                    limit=budget.limit,
                                    month=budget.month.strftime("%Y-%m-%d")))
    
    return Status(200, results)
    