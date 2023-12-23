from django.urls import path
from .views import signin, index, admin_page, back_to_index, signup, signout
urlpatterns = [
    path('', signin),
    path('signup', signup),
    path('signout', signout),
    path('index', index),
    path('admin_page', admin_page),
    path('index_back', back_to_index),
]