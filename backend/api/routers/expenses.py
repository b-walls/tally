import logging
from datetime import date, timedelta

from ninja import Router, Status
from api.auth import SessionAuth

from api.models import Expense, Receipt
from api.schema import Message, ExpenseMixSchema

logger = logging.getLogger(__name__)

expense_router = Router(auth=SessionAuth())

def resolve_expense_mix(item, type):
    return ExpenseMixSchema(type=type, id=item.id, merchant=item.merchant, total=item.total, date=item.date)

def consolidate_expenses(receipts: list[Receipt], expenses: list[Expense]) -> list[ExpenseMixSchema]:
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
            receipt_date = receipts[receipts_ptr].date
            expenses_date = expenses[expenses_ptr].date
            
            if receipt_date < expenses_date:
                result.append(resolve_expense_mix(receipts[receipts_ptr], "receipt"))
                receipts_ptr += 1
            else:
                result.append(resolve_expense_mix(expenses[expenses_ptr], "expense"))
                expense_ptr += 1
    
    return result

@expense_router.get("/range", response={200: list[ExpenseMixSchema], 422: Message})
def get_expenses_within_range(request, start: date, end: date):
    if not start or not end:
        return Status(422, {"message": "Missing start or end date"})

    user = request.user
    receipts = list(Receipt.objects.filter(user=user, date__range=(start, end)).order_by("date").select_related())
    expenses = list(Expense.objects.filter(user=user, date__range=(start, end)).order_by("date").select_related('category'))

    result = consolidate_expenses(receipts, expenses)
    
    return Status(200, result)


@expense_router.get("/recent", response={200: list[ExpenseMixSchema], 403: Message,  422: Message})
def get_recent_expenses(request, max: int = 30):
    if max > 365:
        return Status(403, "Range too large")
    
    start = date.today() - timedelta(days=max)
    end = date.today() + timedelta(days=1)

    user = request.user
    receipts = list(Receipt.objects.filter(user=user, date__range=(start, end)).order_by("-date").select_related())
    expenses = list(Expense.objects.filter(user=user, date__range=(start, end)).order_by("-date").select_related('category'))
    
    result = consolidate_expenses(receipts, expenses)
    
    return Status(200, result)