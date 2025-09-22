from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Report, Announcement


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True},
            "is_verified": {"read_only": True},
        }

    def create(self, validated_data):
        raw_password = validated_data.pop("password")
        validated_data["password"] = make_password(raw_password)
        return super().create(validated_data)


class AadhaarVerificationSerializer(serializers.Serializer):
    aadhar_number = serializers.CharField(max_length=12)
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        if data["otp"] != "123456":  # mock OTP
            raise serializers.ValidationError("Invalid OTP for Aadhaar verification.")
        return data

    def save(self, **kwargs):
        aadhar_number = self.validated_data["aadhar_number"]
        try:
            user = User.objects.get(aadhar_number=aadhar_number)
            user.is_verified = True
            user.save()
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this Aadhaar does not exist.")
        
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = "__all__"

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"
        read_only_fields = ["id", "created_at"]
