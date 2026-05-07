import logging
from collections import defaultdict
from datetime import date, timedelta

from ninja import Router, Status
from api.auth import SessionAuth

from django.contrib.auth.models import User
from django.db.models import Sum
from django.shortcuts import get_object_or_404

from api.models import Budget, Expense
from api.schema import GetBudgetSchema, BudgetRemainingSchema, UpdateBudgetSchema, Message

logger = logging.getLogger(__name__)

budget_router = Router()

def get_period_start(period):
    today = date.today()
    if period == "weekly":
        return today - timedelta(days=today.weekday() + 1)
    else:
        return today.replace(day=1)


@budget_router.get("/remaining", response={200: list[BudgetRemainingSchema]})
def get_remaining_budget(request, username: str | None = None):
    """Gets the remaining balance on each budget for a user"""
    user = request.user

    if user.is_superuser and username is not None:
        user = User.objects.get(username=username)

    today = date.today()
    budgets = list(Budget.objects.filter(user=user).select_related('category'))

    period_starts = {b.period: get_period_start(b.period) for b in budgets}

    # Query expenses per period so weekly budgets don't include older monthly expenses
    expense_totals = {}
    for period, start in period_starts.items():
        for row in Expense.objects.filter(
                                          user=user,
                                          date__range=(start, today),
                                         ).values('category_id').annotate(total=Sum('total')):
            expense_totals[(row['category_id'], period)] = row['total']

    results = []
    for budget in budgets:
        spent = expense_totals.get((budget.category_id, budget.period)) or 0
        results.append(BudgetRemainingSchema(id=budget.id,
                                             category=budget.category,
                                             limit=float(budget.limit),
                                             spent=spent,
                                             remaining=float(budget.limit - spent),
                                             period=budget.period))

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
    budget = get_object_or_404(Budget, id=id)
    category = budget.category

    if not (budget.user == user or user.is_superuser):
        return Status(403, "Unauthorized")

    budget_changed = False
    category_changed = False
    
    # Budget stuff
    if payload.limit is not None:
        budget.limit = payload.limit
        budget_changed = True
    if payload.period is not None:
        budget.period = payload.period
        budget_changed = True

    # Category stuff
    if payload.icon is not None:
        category.icon = payload.icon
        category_changed = True
    if payload.color is not None:
        category.color = payload.color
        category_changed = True
    if payload.name is not None:
        category.name = payload.name
        category_changed = True
    
    if budget_changed:
        budget.save()
    if category_changed:
        category.save()

    return Status(200, budget)