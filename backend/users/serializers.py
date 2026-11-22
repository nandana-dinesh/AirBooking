from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'role', 'approval_status', 'is_staff',
            'is_superuser', 'date_joined'
        ]
        read_only_fields = ['id', 'approval_status', 'role', 'is_staff', 'is_superuser', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'phone_number', 'password', 'password2'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        # All newly registered users default to pending approval
        user = User(
            approval_status=User.STATUS_PENDING,
            role=User.ROLE_CUSTOMER,
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer that blocks unapproved or rejected users with clear status messages.
    """
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # Allow logging in with either username or email
        user = None
        if '@' in username:
            user = User.objects.filter(email=username).first()
        if not user:
            user = User.objects.filter(username=username).first()

        if user is None or not user.check_password(password):
            raise AuthenticationFailed("No active account found with the given credentials.")

        if not user.is_active:
            raise AuthenticationFailed("This account is currently inactive.")

        if user.approval_status == User.STATUS_PENDING:
            raise PermissionDenied(
                "Your account is pending admin approval. You will receive an email once approved."
            )

        if user.approval_status == User.STATUS_REJECTED:
            raise PermissionDenied(
                "Your account application was rejected by an administrator. Please contact support."
            )

        # Generate tokens
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data
