from allauth.headless.adapter import DefaultHeadlessAdapter

class CustomHeadlessAdapter(DefaultHeadlessAdapter):
    def serialize_user(self, user):
        data = super().serialize_user(user)
        data["is_superuser"] = user.is_superuser
        data["first_name"] = user.first_name
        data["last_name"] = user.last_name
        return data