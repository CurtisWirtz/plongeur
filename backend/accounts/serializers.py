from rest_framework import serializers
from django.contrib.auth import get_user_model


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
class RegisterUserSerializer(serializers.ModelSerializer):
    # Password is write_only so it's never sent back in a request
    password = serializers.CharField(write_only=True)

    # Define the honeypots here so it doesn't look at the user model for these non-existent fields
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    confirm_email = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'website', 'confirm_email']

    def validate(self, data):
        request = self.context.get('request')
        session_key = request.session.get('honeypot_key')

        # Check simple honeypot
        if data.get('website'):
            raise serializers.ValidationError("Bot detected - Website Field.")

        # Verify the JS-injected honeypot_key matches the session
        if data.get('confirm_email') != session_key:
            raise serializers.ValidationError("Bot detected - Confirm Email Field.")

        # Clear the key, do not reuse
        del request.session['honeypot_key']
        return data

    # This method is called by ModelSerializer.save() after validation
    def create(self, validated_data):
        validated_data.pop('website', None)
        validated_data.pop('confirm_email', None)

        # Create the user using Django's recommended create_user method, create_user handles the password hashing automatically
        return User.objects.create_user(**validated_data)
