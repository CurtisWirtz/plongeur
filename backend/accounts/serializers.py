from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UnverifiedUser


# Since we extended the existing Django user model
User = get_user_model()

# Used for Output: sending user data to React (the api/accounts/user/ auth check or Login responses)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Explicitly list all fields is safer than '__all__' + tuple for custom fields
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number']
        read_only_fields = fields

# Used for Input: receives new user data from React (creating new users or updating user fields)
class ReserveEmailSerializer(serializers.ModelSerializer):
    # Define the honeypots here so it doesn't look at the user model for these non-existent fields
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    confirm_email = serializers.CharField(write_only=True)

    class Meta:
        model = UnverifiedUser
        fields = ['email', 'website', 'confirm_email']

    # Check if the email is taken by either a User or UnverifiedUser account 
    def validate_email(self, value):
        # First, check the verified User table
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already in use.")
        
        # Next, check the UnverifiedUser table
        # BTW: the serializer already checks the UnverifiedUser table identified in Meta
        # BUT if the UnverifiedUser with the email hasn't verified via email in 24 hours, is_expired will be true. Recreate the account (refreshing the is_expired)
        if UnverifiedUser.objects.filter(email=value).exists():
            unverified_user = UnverifiedUser.objects.get(email=value)

            if unverified_user.is_expired:
                # OTP is expired, delete the record so we can generate a new OTP and refresh the expiration date
                unverified_user.delete()
            else:
                # OTP is still active and pending email verification
                raise serializers.ValidationError("Registration currently pending, check your email for verification code.")
        
        return value

    # Checks data object, check the session honeypots
    def validate(self, data):
        request = self.context.get('request')
        session_key = request.session.get('honeypot_key')

        # Check simple honeypot
        if data.get('website'):
            raise serializers.ValidationError("Bot detected - Website Field.")

        # Verify that the JS-injected honeypot_key matches the session
        if data.get('confirm_email') != session_key:
            raise serializers.ValidationError("Bot detected - Confirm Email Field.")

        # Clear the honeypot key, do not reuse
        del request.session['honeypot_key']

        return data
    
    # This method is called by ModelSerializer.save() after validation
    def create(self, validated_data):
        validated_data.pop('website', None)
        validated_data.pop('confirm_email', None)

        # Create the new UnverifiedUser
        return UnverifiedUser.objects.create(**validated_data)
    
