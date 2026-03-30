import logging
from datetime import date, timedelta

from ninja import Router, Status
from api.auth import SessionAuth

from api.models import Expense
from api.schema import Message, ExpenseMixSchema

logger = logging.getLogger(__name__)

expense_router = Router(auth=SessionAuth())

VALID_SORTS = {"date", "-date", "total", "-total"}


@expense_router.get("/range", response={200: list[ExpenseMixSchema], 422: Message})
def get_expenses_within_range(request, start: date, end: date, sort: str = "date"):
    if sort not in VALID_SORTS:
        return Status(422, {"message": "Unsupported sort parameter"})

    user = request.user
    expenses = Expense.objects.filter(user=user, date__range=(start, end)).order_by(sort).select_related('category')
    return Status(200, [
        ExpenseMixSchema(id=e.id, merchant=e.merchant, total=float(e.total),
                         date=e.date, category=e.category.name, receipt_id=e.receipt_id)
        for e in expenses
    ])
