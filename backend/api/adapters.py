from allauth.account.adapter import DefaultAccountAdapter
from allauth.headless.adapter import DefaultHeadlessAdapter


# class CustomAccountAdapter(DefaultAccountAdapter):
#     def save_user(self, request, user, form, commit=True):
#         user = super().save_user(request, user, form, commit=commit)
#         if commit:
#             from api.models import Category, Budget, UserSettings, CATEGORY_CHOICES
#             UserSettings.objects.get_or_create(user=user)
#             for item in CATEGORY_CHOICES:
#                 category, created = Category.objects.get_or_create(name=item, user=user)
#                 if created:
#                     Budget.objects.create(user=user, category=category, limit=0)
#         return user


class CustomHeadlessAdapter(DefaultHeadlessAdapter):
    def serialize_user(self, user):
        data = super().serialize_user(user)
        data["is_superuser"] = user.is_superuser
        data["first_name"] = user.first_name
        data["last_name"] = user.last_name
        return data