import logging
from datetime import date, timedelta

from ninja import Router, Status
from api.auth import SessionAuth

from api.models import Expense, Receipt
from api.schema import Message, ExpenseMixSchema

logger = logging.getLogger(__name__)

expense_router = Router(auth=SessionAuth())

STR_TO_COMPARISON = {
    "date": lambda r, e: -1 if r.date < e.date else 0,
    "-date": lambda r, e: -1 if e.date < r.date else 0,
    "total": lambda r, e: -1 if r.total < e.total else 0,
    "-total": lambda r, e: -1 if e.total < r.total else 0 
}

def resolve_expense_mix(item, type):
    category = item.category.name if type == "expense" else "Receipt"
    return ExpenseMixSchema(type=type, id=item.id, merchant=item.merchant, total=item.total, date=item.date, category=category)

def date_less_than(receipt, expense):
    if receipt.date < expense.date:
        return -1
    else:
        return 1


def consolidate_expenses(receipts: list[Receipt], expenses: list[Expense], comparison) -> list[ExpenseMixSchema]:
    receipts_ptr = 0
    expenses_ptr = 0
    result = []

    while (receipts_ptr < len(receipts) or expenses_ptr < len(expenses)):
        # out of range 
        if receipts_ptr >= len(receipts):
            result.append(resolve_expense_mix(expenses[expenses_ptr], "expense"))
            expenses_ptr += 1
        elif expenses_ptr >= len(expenses):
            result.append(resolve_expense_mix(receipts[receipts_ptr], "receipt"))
            receipts_ptr += 1
        
        # both in range
        else:
            comparison_result = comparison(receipts[receipts_ptr], expenses[expenses_ptr])
            
            if comparison_result == -1:
                result.append(resolve_expense_mix(receipts[receipts_ptr], "receipt"))
                receipts_ptr += 1
            else:
                result.append(resolve_expense_mix(expenses[expenses_ptr], "expense"))
                expenses_ptr += 1
    
    return result

@expense_router.get("/range", response={200: list[ExpenseMixSchema], 422: Message})
def get_expenses_within_range(request, start: date, end: date, sort: str = "date"):
    if not start or not end:
        return Status(422, {"message": "Missing start or end date"})

    user = request.user
    receipts = list(Receipt.objects.filter(user=user, date__range=(start, end)).order_by(sort).select_related())
    expenses = list(Expense.objects.filter(user=user, date__range=(start, end)).order_by(sort).select_related('category'))

    try:
        comparison = STR_TO_COMPARISON[sort]
    except:
        return Status(422, "Unsuported sort parameter")
    
    result = consolidate_expenses(receipts, expenses, comparison)
    
    return Status(200, result)


@expense_router.get("/recent", response={200: list[ExpenseMixSchema], 403: Message,  422: Message})
def get_recent_expenses(request, max: int = 30, sort: str = "-date"):
    if max > 365:
        return Status(403, "Range too large")
    
    start = date.today() - timedelta(days=max)
    end = date.today() + timedelta(days=1)

    user = request.user
    receipts = list(Receipt.objects.filter(user=user, date__range=(start, end)).order_by(sort).select_related())
    expenses = list(Expense.objects.filter(user=user, date__range=(start, end)).order_by(sort).select_related('category'))
    
    try:
        comparison = STR_TO_COMPARISON[sort]
    except:
        return Status(422, "Unsuported sort parameter")
        
    result = consolidate_expenses(receipts, expenses, comparison)
    
    return Status(200, result)