import logging

from ninja import Router, Status
from ninja_jwt.tokens import RefreshToken, TokenError

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import HttpResponse

from api.models import Category, Budget, UserSettings, CATEGORY_CHOICES
from api.auth import CookieAuth, set_auth_cookies, clear_auth_cookies, REFRESH_COOKIE
from api.schema import Message, RegisterSchema, LoginSchema, UserSchema

logger = logging.getLogger(__name__)

auth_router = Router()


@auth_router.post("/register", response={200: Message, 400: Message, 409: Message, 500: Message})
def register(request, credentials: RegisterSchema):
    try:
        validate_password(credentials.password)
        user = User.objects.create_user(credentials.email,
                                        credentials.email,
                                        credentials.password)
        user.first_name = credentials.first_name
        user.last_name = credentials.last_name
        user.save()

        UserSettings.objects.create(user=user)
        
        for item in CATEGORY_CHOICES:
            category = Category.objects.create(name=item, user=user)
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
    user = authenticate(username=credentials.username, password=credentials.password)
    if not user:
        return Status(401, {'message': 'Invalid username or password'})

    response = HttpResponse()
    set_auth_cookies(response, user)
    response["Content-Type"] = "application/json"
    response.content = b'{"message": "Login successful"}'
    return response

@auth_router.get("/me", auth=CookieAuth(), response={200: UserSchema, 401: Message})
def user_info(request):
    user = request.auth
    return 200, user


@auth_router.post("/logout", auth=CookieAuth())
def logout(request):
    refresh_token = request.COOKIES.get(REFRESH_COOKIE)
    if refresh_token:
        try:
            RefreshToken(refresh_token).blacklist()
        except TokenError:
            pass  # already invalid, proceed with clearing cookies

    response = HttpResponse()
    clear_auth_cookies(response)
    response["Content-Type"] = "application/json"
    response.content = b'{"message": "Logged out successfully"}'
    return response


@auth_router.post("/refresh", response={200: Message, 401: Message})
def refresh(request):
    refresh_token = request.COOKIES.get(REFRESH_COOKIE)
    if not refresh_token:
        return Status(401, {'message': 'No refresh token'})

    try:
        refresh = RefreshToken(refresh_token)
        user = User.objects.get(id=refresh["user_id"])
    except (TokenError, User.DoesNotExist):
        return Status(401, {'message': 'Invalid or expired refresh token'})

    response = HttpResponse()
    set_auth_cookies(response, user)
    response["Content-Type"] = "application/json"
    response.content = b'{"message": "Token refreshed"}'
    return response
