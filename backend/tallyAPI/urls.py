from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ninja_extra import NinjaExtraAPI

from api.routers.receipts import receipt_router
from api.routers.auth import auth_router
from api.routers.budget import budget_router
from api.routers.category import category_router
from api.routers.expenses import expense_router

api = NinjaExtraAPI(
    title='Tally API',
    version='1.0.0',
    description='Receipt scanning and budget tracking',
)

api.add_router('/receipts', receipt_router)
api.add_router('/budget', budget_router)
api.add_router('/category', category_router)
api.add_router('/auth', auth_router)
api.add_router('/expense', expense_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
