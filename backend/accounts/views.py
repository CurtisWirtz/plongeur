from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login


class LoginView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def post(self, request):

        # DRF puts parsed JSON data in request.data
        email = request.data.get('email')
        password = request.data.get('password')

        # Input fallbacks
        if not email:
            return Response({"message": "Email required."}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({"message": "Password required."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check the user credentials
        user = authenticate(request, email=email, password=password)

        if user is not None:
            # Start the session and send the sessionid cookie
            login(request, user)

            # Send back the user info in the response body so the frontend can store it in state and display it
            return Response({
                "message": "Successfully logged in.",
                "user": {
                    "email": user.email,
                }
            }, status=status.HTTP_200_OK)

        # Fail gracefully
        return Response({"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

# Quick auth check endpoint - the frontend can call this on app and page load to check if the user has a valid session cookie, then return their user info
@api_view(['GET'])
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
def get_session_user(request):
    return Response({
        "id": request.user.id,
        "email": request.user.email
    })