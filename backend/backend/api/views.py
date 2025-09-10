from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer


# User signup
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# Aadhaar verification (mock)
class AadhaarVerificationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        aadhaar_number = request.data.get("aadhaar_number")
        otp = request.data.get("otp")

        if not aadhaar_number or len(aadhaar_number) != 12 or not aadhaar_number.isdigit():
            return Response({"error": "Invalid Aadhaar number"}, status=status.HTTP_400_BAD_REQUEST)

        if otp != "123456":  # Mock OTP
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(aadhar_number=aadhaar_number)
            user.is_verified = True
            user.save()
            return Response({"message": "Aadhaar verified successfully (mock)"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this Aadhaar not found"}, status=status.HTTP_404_NOT_FOUND)
