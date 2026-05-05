from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UnverifiedUser

class CustomUserAdmin(UserAdmin):
    # So the 'Add User' page doesn't ask for a username
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password'),
        }),
    )
    
    # Edit page - with username omitted
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Account Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Timestamps', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Table view
    list_display = ('email', 'is_staff', 'is_active')
    search_fields = ('email',)
    ordering = ('email',)

class UnverifiedUserAdmin(admin.ModelAdmin):
    list_display = ("email", "OTP", "created_at", "is_expired")

    readonly_fields = ("created_at", "is_expired")
    fieldsets = (
        (None, {
            'fields': ('email', "OTP", "created_at", "is_expired")
        }),
    )

# Register your models
admin.site.register(User, CustomUserAdmin)
admin.site.register(UnverifiedUser, UnverifiedUserAdmin)