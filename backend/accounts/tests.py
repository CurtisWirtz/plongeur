from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

User = get_user_model()

class UserModelTest(TestCase):
    def setUp(self):
        # User without username should succeed
        self.user = User.objects.create_user(
            email = "TesT@Test.com",
            password = "test",
            phone_number = "+11 (555) 555-555 Ext. 55555",
        )

    def test_create_user_creation(self):
        """ 
            1. Creating a user does not take a username, requires an email instead
            2. The email gets normalized to a lowercase string (TesT@Test.com -> test@test.com) 
            3. 
        """
        self.assertEqual(self.user.email, 'test@test.com')
        self.assertEqual(self.user.username, None) 
        self.assertIsInstance(self.user.phone_number, str) # Phone number is a string (integers could have leading zero, will be stored incorrectly)
        
    def test_email_uniqueness(self):
        """Accounts with duplicate emails raise an IntegrityError (problem at the DB level)."""
        with self.assertRaises(IntegrityError):
            User.objects.create_user(email='test@test.com', password='test') # same email as the user created in setUp 

    def test_multiple_users_can_have_null_username(self):    
        """ Multiple users can have the username None (NULL), since NULL != NULL in the DB """
        user2 = User.objects.create_user(
            email = "TEsT2@Test.com",
            password = "test",
            phone_number = "+11 (555) 555-555 Ext. 55555",
        )

    def test_create_superuser(self):
        """Test superuser creation with email instead of a username"""
        superuser = User.objects.create_superuser(
            email='ADMIN@test.com',
            password='password123'
        )
        self.assertTrue(superuser.is_superuser)
        self.assertEqual(self.user.email, 'test@test.com')
        self.assertEqual(self.user.username, None)