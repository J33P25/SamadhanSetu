from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, AadhaarVerificationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # User Registration
    path('api/user/register/', CreateUserView.as_view(), name='register'),

    # Aadhaar Verification (mock)
    path('api/user/verify-aadhaar/', AadhaarVerificationView.as_view(), name='verify-aadhaar'),

    # JWT Auth
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),

    # Browsable API login/logout
    path('api-auth/', include('rest_framework.urls')),
]
