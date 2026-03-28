import logging
from datetime import date

from ninja import Router, Status
from api.auth import SessionAuth

from api.models import Expense, Receipt
from api.schema import Message, ExpenseRange

logger = logging.getLogger(__name__)

expense_router = Router(auth=SessionAuth())


@expense_router.get("/", response={200: ExpenseRange, 422: Message})
def get_expenses_within_range(request, start: date, end: date):
    if not start or not end:
        return Status(422, {"message": "Missing start or end date"})

    user = request.user
    receipts = list(Receipt.objects.filter(user=user, date__range=(start, end)).order_by("date").select_related())
    expenses = list(Expense.objects.filter(user=user, date__range=(start, end)).order_by("date").select_related('category'))

    return Status(200, ExpenseRange(receipts=receipts, expenses=expenses))
