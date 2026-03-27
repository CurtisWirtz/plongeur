from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout


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
        
        # Check the user credentials
        user = authenticate(request, email=email, password=password)

        if user is not None:
            # Start the session and send the sessionid cookie
            login(request, user)

            # Send back the user info in the response body so the frontend can store it in state and display it
            return Response({
                "detail": "Successfully logged in.",
                "user": {
                    "email": user.email,
                }
            }, status=status.HTTP_200_OK)

        # Fail gracefully
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
def get_session_user(request):
    """
    Quick auth check endpoint:
    The frontend can call this on app or page load to check if the user has a valid session, then return that user's info
    """
    return Response({
        "id": request.user.id,
        "email": request.user.email
    })

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
    return Response({"detail": f"Successfully logged out {request.user.email}"}, status=200)