from rest_framework import generics, status, viewsets, permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Report, Announcement
from .serializers import UserSerializer, ReportSerializer, AnnouncementSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .tokens import CustomTokenObtainPairSerializer


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class AadhaarVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        aadhaar_number = request.data.get("aadhaar_number")
        otp = request.data.get("otp")

        if not aadhaar_number or len(aadhaar_number) != 12 or not aadhaar_number.isdigit():
            return Response({"error": "Invalid Aadhaar number"}, status=status.HTTP_400_BAD_REQUEST)

        if otp != "123456":
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(aadhar_number=aadhaar_number)
            user.is_verified = True
            user.save()
            return Response({"message": "Aadhaar verified successfully (mock)"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this Aadhaar not found"}, status=status.HTTP_404_NOT_FOUND)


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by("-created_at")
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]  

    def perform_create(self, serializer):
        serializer.save(status="pending")

    def perform_update(self, serializer):
        if "status" in serializer.validated_data:
            if not self.request.user.is_authenticated or getattr(self.request.user, "role", None) != "district_leader":
                return Response({"error": "You are not allowed to update the status"}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()

class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.all().order_by('-date')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny] 