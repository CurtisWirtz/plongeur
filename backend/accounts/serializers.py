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
    
class VerifyEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnverifiedUser
        fields = ['OTP']

    def validate(self, data):
        request = self.context.get('request')
        pending_email = request.session.get('pending_email')

        # Check if the session exists
        if not pending_email:
            raise serializers.ValidationError("Session expired. Please restart.")

        if UnverifiedUser.objects.filter(email=pending_email).exists():
            # Look up the UnverifiedUser with that email
            try:
                pending_user = UnverifiedUser.objects.get(email=pending_email)
            except UnverifiedUser.DoesNotExist:
                raise serializers.ValidationError("No registration found for this email.")

            # Check to see if the OTP has expired, if it has delete that UnverifiedUser
            if pending_user.is_expired:
                pending_user.delete()
                raise serializers.ValidationError("Code expired. Please try again.")
        
            # Validate OTP submitted matches the OTP on record for the UnverifiedUser claiming that email
            if data.get('OTP') != pending_user.OTP:
                raise serializers.ValidationError({"OTP": "The code you entered is incorrect."})
            
            return data
        
class FinalizeSerializer(serializers.Serializer):
    # Password is write_only so it's never sent back in a request
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=150, allow_blank=True, allow_null=True)

    def validate(self, data):
        request = self.context.get('request')
        email = request.session.get('pending_email')
        lowercase_email = email.strip().lower()
        finalize = request.session.get('finalize')

        if not finalize:
            raise serializers.ValidationError("Unauthorized session. Please restart registration.")

        if not lowercase_email:
            raise serializers.ValidationError("Session expired. Please restart registration.")
        
        # One last check to see if that email doesn't already belong to a registered user
        if User.objects.filter(email=lowercase_email).exists():
            raise serializers.ValidationError("User with that email already exists.")
        
        # Take email from session and pass it to the data object we will construct the new user with
        data['email'] = lowercase_email

        # Pass along the freshly validated data
        return data
    
    def create(self, validated_data):
        # Create the user using Django's recommended create_user method, create_user handles the password hashing automatically
        return User.objects.create_user(**validated_data)