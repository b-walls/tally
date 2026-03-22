import logging

from ninja.security import HttpBearer
from ninja_jwt.tokens import AccessToken, RefreshToken, TokenError

from django.contrib.auth.models import User

logger = logging.getLogger(__name__)

ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"

ACCESS_MAX_AGE = 15 * 60        # 15 minutes
REFRESH_MAX_AGE = 7 * 24 * 3600  # 7 days


class CookieAuth(HttpBearer):
    def __call__(self, request):
        token = request.COOKIES.get(ACCESS_COOKIE)
        if not token:
            return None
        return self.authenticate(request, token)

    def authenticate(self, request, token):
        try:
            validated = AccessToken(token)
            user = User.objects.get(id=validated["user_id"])
            request.user = user
            return user
        except (TokenError, User.DoesNotExist):
            return None


def set_auth_cookies(response, user):
    """Mint new tokens and attach them as HttpOnly cookies to response."""
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)

    _set_cookie(response, ACCESS_COOKIE, access, ACCESS_MAX_AGE)
    _set_cookie(response, REFRESH_COOKIE, str(refresh), REFRESH_MAX_AGE)


def clear_auth_cookies(response):
    response.delete_cookie(ACCESS_COOKIE)
    response.delete_cookie(REFRESH_COOKIE)


def _set_cookie(response, key, value, max_age):
    response.set_cookie(
        key,
        value,
        max_age=max_age,
        httponly=True,
        secure=False,   # Set True in production (requires HTTPS)
        samesite="Lax",
        path="/",
    )
