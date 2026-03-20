import logging

from ninja import Router, Status
from ninja_jwt.authentication import JWTAuth

from django.contrib.auth.models import User

from api.models import Category
from api.schema import CategorySchema

logger = logging.getLogger(__name__)

category_router = Router(auth=JWTAuth())

@category_router.get("/", response={200: list[CategorySchema]})
def get_categories(request, username: str | None = None):

    user = request.user

    if user.is_superuser and username is not None:
        user = User.objects.get(username=username)

    categories = Category.objects.filter(user=user)
    return Status(200, [CategorySchema(id=c.id, category=c.name) for c in categories])