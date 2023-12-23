from django.urls import path, include

#Контроллеры:
from .AccountController import Account 
from .AdminAccountController import AdminAccount
from .TransportController import Transport
from .AdminTransportController import AdminTransport
from .RentController import Rent
from .AdminRentController import AdminRent


#Для Swagger
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="MyDrive",
        default_version='v1.0',
        description="Documentation for API",
        terms_of_service="",
        contact=openapi.Contact(email="kne.21@uni-dubna.ru"),
        license=openapi.License(name="Licence"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('Account/SignUp', Account.as_view({'post': 'signup'})),
    path('Account/SignIn', Account.as_view({'post': 'signin'})),
    path('Account/Me', Account.as_view({'get': 'get_account'})),
    path('Account/SignOut', Account.as_view({'post': 'signout'})), #Сделать инвалидным токен
    path('Account/Update', Account.as_view({'put': 'update_account'})), #Изменить пароль, если не меняется имя пользователя

    path('Admin/Account', AdminAccount.as_view({'get': 'admin_get_accounts'})),
    path('Admin/Account/<int:u_id>', AdminAccount.as_view({'get': 'admin_get_account'})),
    path('Admin/AccountCreate', AdminAccount.as_view({'post': 'admin_create_account'})),
    path('Admin/AccountUpdate/<int:u_id>', AdminAccount.as_view({'put': 'admin_update_account'})),
    path('Admin/AccountDelete/<int:u_id>', AdminAccount.as_view({'delete': 'admin_delete_account'})),

    path('Transport', Transport.as_view({'post': 'create_transport'})),
    path('Transport/<int:tr_id>', Transport.as_view({'get': 'get_transport_info'})),
    path('TransportUpdate/<int:tr_id>', Transport.as_view({'put': 'update_transport'})),
    path('TransportDelete/<int:tr_id>', Transport.as_view({'delete': 'delete_transport'})),
    path('Transport/My', Transport.as_view({'get': 'get_my_trnsp'})),

    path('Admin/Transport', AdminTransport.as_view({'get': 'admin_get_transports'})),
    path('Admin/Transport/<int:tr_id>', AdminTransport.as_view({'get': 'admin_get_into_tf'})),
    path('Admin/TransportCreate', AdminTransport.as_view({'post': 'admin_create_transport'})),
    path('Admin/TransportUpdate/<int:tr_id>', AdminTransport.as_view({'put': 'admin_update_transport'})),
    path('Admin/TransportDelete/<int:tr_id>', AdminTransport.as_view({'delete': 'admin_delete_transport'})), 

    path('Rent/Transport', Rent.as_view({'get': 'get_transport_for_rent'})),
    path('Rent/TransportPl', Rent.as_view({'get': 'get_transport_for_rent2'})),
    path('Rent/MyRents', Rent.as_view({'get': 'get_my_rents'})),
    path('Rent/<int:rent_id>', Rent.as_view({'get': 'get_rent_info'})),
    path('Rent/MyHistory', Rent.as_view({'get': 'get_rent_his'})),
    path('Rent/TransportHistory/<int:tr_id>', Rent.as_view({'get': 'get_transport_rent_his'})),
    path('Rent/New/<int:tr_id>', Rent.as_view({'post': 'create_rent'})),
    path('Rent/End/<int:rent_id>', Rent.as_view({'post': 'delete_rent'})),
    path('Rent/Points', Rent.as_view({'get': 'get_rent_points'})),

    path('Admin/Rent/<int:rent_id>', AdminRent.as_view({'get': 'admin_get_rent_info'})),
    path('Admin/Rent/UserHistory/<int:u_id>', AdminRent.as_view({'get': 'admin_get_rent_his_user'})),
    path('Admin/Rent/TransportHistory/<int:tr_id>', AdminRent.as_view({'get': 'admin_get_transport_rent_his'})),
    path('Admin/Rent', AdminRent.as_view({'post': 'admin_create_rent'})),
    path('Admin/Rent/End/<int:rent_id>', AdminRent.as_view({'post': 'admin_delete_rent'})),
    path('Admin/RentDelete/<int:rent_id>', AdminRent.as_view({'delete': 'admin_rent_delete'})),
    path('Admin/Rent/Current/<int:u_id>', AdminRent.as_view({'get': 'get_curr_rent_user'})),


    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0))
]