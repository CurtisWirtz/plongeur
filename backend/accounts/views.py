from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer, ReserveEmailSerializer, VerifyEmailSerializer
from django.contrib.auth import get_user_model
from .models import UnverifiedUser
import random
import string


User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def post(self, request):

        # DRF puts parsed JSON data in request.data
        email = request.data.get('email')
        password = request.data.get('password')

        # Input fallbacks
        if not email:
            return Response({"detail": "Email required."}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({"detail": "Password required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the user exists with the given email
        try:
            User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Email not found."}, status=status.HTTP_401_UNAUTHORIZED)

        # The user exists, try to authenticate the password
        user = authenticate(request, email=email, password=password)

        if user is not None:
            # Start the session and send the sessionid cookie
            login(request, user)

            # Send back the user info in the response body so the frontend can store it in state and display it
            return Response({
                "detail": "Successfully logged in.",
                "user": UserSerializer(user).data,
            }, status=status.HTTP_200_OK)

        # Fail gracefully
        return Response({"detail": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
def get_session_user(request):
    """
    Quick auth check endpoint:
    The frontend can call this on app or page load to check if the user has a valid session, then return that user's info
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@ensure_csrf_cookie
@permission_classes([IsAuthenticated]) # Only for logged-in users
def logout_user(request):
    """    
    Logout - the frontend COULD just delete the sessionid cookie, BUT...
    We want to destroy the session in the DB (and clear the cookie)... which changes the state, and thus we use a POST request
    """
    print(f"Logging out user: {request.user.email}")
    logout(request)
    return Response({"detail": "Successfully logged out."}, status=200)

@api_view(['GET'])
@ensure_csrf_cookie
@permission_classes([AllowAny])
def get_honeypot(request):
    # Generate a random string
    rando_string = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    # give it an email format
    honeypot_key = rando_string + '@gmail.com'
    
    # Store it in the session (requires SessionMiddleware)
    request.session['honeypot_key'] = honeypot_key
    return Response({'honeypot_key': honeypot_key})

class ReserveEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ReserveEmailSerializer(
            data=request.data,
            context={'request': request} # critical for passing the honeypot_key to serializer for validation
        )

        # serializer.is_valid() will catch if the email is already in use by either a verified or unverified user.
        # the serializer also checks honeypots, and if they pass, it removes the honeypot key from session. A user cannot pass further without that key.
        if serializer.is_valid():
            # create the UnverifiedUser and clear the honeypot data 
            pending_user = serializer.save() # calls create() in serializer

            # save the pending email to session data so the /register/verify route loader guard can authorize being the user navigating to that page 
            request.session['pending_email'] = pending_user.email
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # If invalid, it returns specific field errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

