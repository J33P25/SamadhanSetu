from django.contrib import admin
from django.urls import path, include
from api.views import (
    CreateUserView,
    AadhaarVerificationView,
    CustomTokenObtainPairView,
    ReportViewSet,
    AnnouncementListCreateView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static

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

    # Reports
    path("api/", include(router.urls)),

    # Announcements
    path("api/announcements/", AnnouncementListCreateView.as_view(), name="announcements"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
