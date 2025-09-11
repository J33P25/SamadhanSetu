from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ Add extra user info to token
        token['full_name'] = user.full_name
        token['role'] = user.role
        token['email'] = user.email
        token['is_verified'] = user.is_verified

        return token
