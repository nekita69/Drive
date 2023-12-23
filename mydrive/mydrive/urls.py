from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('driveapp.urls')),
    path('api/', include('mydriveapi.urls')),
    path('admin/', admin.site.urls),
]
