import logging

from ninja import Router, Status

from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from api.models import Category, Budget, UserSettings, CATEGORY_CHOICES
from api.auth import SessionAuth
from api.schema import Message, RegisterSchema, LoginSchema, UserSchema

logger = logging.getLogger(__name__)

auth_router = Router()


@auth_router.post("/register", response={200: Message, 400: Message, 409: Message, 500: Message}, auth=None)
def register(request, credentials: RegisterSchema):
    try:
        validate_password(credentials.password)
        user = User.objects.create_user(credentials.email,
                                        credentials.email,
                                        credentials.password)
        user.first_name = credentials.first_name
        user.last_name = credentials.last_name
        user.save()

        for item in CATEGORY_CHOICES:
            category = Category.objects.create(user=user, name=item['name'], icon=item['icon'], color=item['color'])
            Budget.objects.create(user=user, category=category, limit=0)

        return Status(200, {'message': 'User created successfully'})
    except IntegrityError:
        return Status(409, {'message': 'Username or email already exists'})
    except ValidationError:
        return Status(400, {'message': 'Invalid password'})
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return Status(500, {'message': 'An unexpected error occurred'})


@auth_router.post("/login", response={200: Message, 401: Message})
def login(request, credentials: LoginSchema):
    user = authenticate(request, username=credentials.username, password=credentials.password)
    if not user:
        return Status(401, {'message': 'Invalid username or password'})

    auth_login(request, user)
    return 200, {'message': 'Login successful'}


@auth_router.get("/me", auth=SessionAuth(), response={200: UserSchema, 401: Message})
def user_info(request):
    return 200, request.user


@auth_router.post("/logout", auth=SessionAuth(), response={200: Message})
def logout(request):
    auth_logout(request)
    return 200, {'message': 'Logged out successfully'}
