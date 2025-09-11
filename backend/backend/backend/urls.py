from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, AadhaarVerificationView, CustomTokenObtainPairView, ReportViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers

router = routers.DefaultRouter()
router.register("reports", ReportViewSet, basename="report")

urlpatterns = [
    path("admin/", admin.site.urls),

    # User Registration
    path("api/user/register/", CreateUserView.as_view(), name="register"),

    # Aadhaar Verification (mock)
    path("api/user/verify-aadhaar/", AadhaarVerificationView.as_view(), name="verify-aadhaar"),

    # JWT Auth
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),

    # Browsable API login/logout
    path("api-auth/", include("rest_framework.urls")),

    # Report endpoints
    path("api/", include(router.urls)),
]
