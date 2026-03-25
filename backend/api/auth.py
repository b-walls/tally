from ninja.security import HttpBearer


class SessionAuth(HttpBearer):
    """
    Session-based auth for Django Ninja.

    Django's AuthenticationMiddleware already populates request.user from the
    session cookie before we get here. We just check it — no CSRF enforcement
    because HttpBearer doesn't trigger it (unlike APIKeyCookie/SessionAuth).
    SameSite=Lax on the session cookie handles CSRF for browser clients.
    """

    def __call__(self, request):
        if request.user.is_authenticated:
            return request.user
        return None

    def authenticate(self, request, token):
        pass
