from .views import * #Все импорты из views.py

#Админ Аккаунт контроллер;
class AdminAccount(viewsets.ViewSet):
    @swagger_auto_schema(
        tags=['AdminAccount'],
        operation_summary="Получение выборки аккаунтов",
        manual_parameters=[
            openapi.Parameter('token', openapi.IN_HEADER, type=openapi.TYPE_STRING),
            openapi.Parameter('start', openapi.IN_HEADER, type=openapi.TYPE_STRING),
            openapi.Parameter('count', openapi.IN_HEADER, type=openapi.TYPE_STRING),
        ],
        responses={
            200: "OK",
            400: openapi.Response(
                description='BAD',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'exception': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
        }
    )
    def admin_get_accounts(self, request):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
                strs = request.headers.get('start')
                cnt = request.headers.get('count')
            except:
                return Response({"exception":"Передайте начало выборки и количество"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.admin_get_accounts(token, strs, cnt)
            if res['status']:
                return Response({"users":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_403_FORBIDDEN)    
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)   
    

    @swagger_auto_schema(
        tags=['AdminAccount'],
        operation_summary="Получение информации о аккаунте пользователя",
        manual_parameters=[
            openapi.Parameter('token', openapi.IN_HEADER, type=openapi.TYPE_STRING),
        ],
        responses={
            200: "OK",
            400: openapi.Response(
                description='BAD',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'exception': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
        }
    )
    def admin_get_account(self, request, u_id):
        if request.method == "GET":
            try:
                token = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            res = manager.admin_get_acc(token, u_id)
            if res['status']:
                return Response({"user":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST) 
    

    @swagger_auto_schema(
        tags=['AdminAccount'],
        operation_summary="Создание аккаунта",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING, default=""),
                'username': openapi.Schema(type=openapi.TYPE_STRING, default=""),
                'password': openapi.Schema(type=openapi.TYPE_STRING, default=""),
                'is_admin': openapi.Schema(type=openapi.TYPE_BOOLEAN, default=False),
                'balance': openapi.Schema(type=openapi.TYPE_NUMBER, default=0.0),
            },
            required=['token', 'username', 'password']
        ),
        responses={
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'response': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
            400: openapi.Response(
                description='BAD',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'exception': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
        }
    )
    def admin_create_account(self, request):
        if request.method == "POST":
            token = request.data['token']
            username = request.data['username']
            password = request.data['password']
            is_admin = request.data['is_admin']
            balance = request.data['balance']
            if(username != "" and password != ""):
                res = manager.admin_create_account(token, username, password, is_admin, balance)
                if res['status']:
                    return Response({"response":res['response']}, status.HTTP_200_OK)
                return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
            return Response({"exception":"Установите имя пользователя и пароль"}, status.HTTP_400_BAD_REQUEST) 
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        tags=['AdminAccount'],
        operation_summary="Изменение аккаунта пользователя",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
                'is_admin': openapi.Schema(type=openapi.TYPE_BOOLEAN, default=False),
                'balance': openapi.Schema(type=openapi.TYPE_NUMBER, default=0.0),
            },
            required=['token', 'username', 'password']
        ),
        responses={
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'response': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
            400: openapi.Response(
                description='BAD',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'exception': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
        }
    )
    def admin_update_account(self, request, u_id):
        if request.method == "PUT":
            token = request.data['token']
            username = request.data['username']
            password = request.data['password']
            is_admin = request.data['is_admin']
            balance = request.data['balance']
            if(username != "" and password != ""):
                res = manager.admin_update_account(token, u_id, username, password, is_admin, balance)
                if res['status']:
                    return Response({"response":res['response']}, status.HTTP_200_OK)
                return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
            return Response({"exception":"Установите имя пользователя и пароль"}, status.HTTP_400_BAD_REQUEST) 
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        tags=['AdminAccount'],
        operation_summary="Удаление аккаунта пользователя",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['token']
        ),
        responses={
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'response': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
            400: openapi.Response(
                description='BAD',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'exception': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
        }
    )
    def admin_delete_account(self, request, u_id):
        if request.method == "DELETE":
            token = request.data['token']
            res = manager.admin_delete_account(token, u_id)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
  