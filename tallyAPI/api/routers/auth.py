import logging

from ninja import Router, Status

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from api.models import Category, CATEGORY_CHOICES
from api.schema import Message, RegisterSchema

logger = logging.getLogger(__name__)

auth_router = Router()


@auth_router.post("/register", response={200: Message, 400: Message, 409: Message, 500: Message})
def register(request, credentials: RegisterSchema):
    try:
        validate_password(credentials.password)
        user = User.objects.create_user(credentials.username,
                                        credentials.email,
                                        credentials.password)
        user.first_name = credentials.first_name
        user.last_name = credentials.last_name
        user.save()
        for item in CATEGORY_CHOICES:
            category = Category.objects.create(name=item, user=user)

        return Status(200, {'message': 'User created successfully'})
    except IntegrityError:
        return Status(409, {'message': 'Username or email already exists'})
    except ValidationError:
        return Status(400, {'message': "Invalid password"})
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return Status(500, {'message': 'An unexpected error occurred'})
