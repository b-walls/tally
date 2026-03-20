from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController

from api.api import receipt_router, auth_router, budget_router

api = NinjaExtraAPI(
    title='Tally API',
    version='1.0.0',
    description='Receipt scanning and budget tracking',
)

api.register_controllers(NinjaJWTDefaultController)
api.add_router('/receipts', receipt_router)
api.add_router('/auth', auth_router)
api.add_router('/budget', budget_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)