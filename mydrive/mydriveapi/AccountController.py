from .views import * #Все импорты из views.py

#Аккаунт контроллер;
class Account(viewsets.ViewSet):
    @swagger_auto_schema(
        tags=['Account'],
        operation_summary="Регистрация",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['username', 'password']
        ),
        responses={
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'response': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
            400: 'Некорректный запрос',
        }
        #responses={200: 'OK', 400: 'Bad Request'}
    )
    def signup(self, request):
        if request.method == "POST":
            data = request.data #Получаем данные, из запрса
            res = manager.signup(data['username'], data['password'])
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        tags=['Account'],
        operation_summary="Авторизация",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['username', 'password']
        ),
        responses={
            200: openapi.Response(
                description='OK',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'token': openapi.Schema(type=openapi.TYPE_STRING)},
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
    def signin(self, request):
        if request.method == "POST":
            data = request.data #Получаем данные, из запрса
            res = manager.signin(data['username'], data['password'])
            if res != None:
                return Response({"token":res}, status.HTTP_200_OK)
            return Response({"exception":"Аккаунт не найден"}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        tags=['Account'],
        operation_summary="Получение информации о аккаунте",
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
    def get_account(self, request):
        if request.method == "GET":
            token  = request.headers.get('token')
            res = manager.get_account(token)
            if res == None:
                return Response({"exception":"Токен недействительный"}, status.HTTP_400_BAD_REQUEST)
            return Response({"account":res}, status.HTTP_200_OK)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    
    
    @swagger_auto_schema(
        tags=['Account'],
        operation_summary="Выход из аккаунта",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['token', 'password']
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
    def signout(self, request):
        if request.method == "POST":  
            token = request.data['token']
            if(manager.is_tokenvalid(token)):
                #Обработка токена;
                return Response({"response":"Вы вышли из аккаунта"}, status.HTTP_200_OK)
        return Response({"exception":"Необходимо авторизоваться"}, status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        tags=['Account'],
        operation_summary="Изменение аккаунта",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'cur_password': openapi.Schema(type=openapi.TYPE_STRING),
                'new_password': openapi.Schema(type=openapi.TYPE_STRING),
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
    def update_account(self, request):
        if request.method == "PUT":
            token = request.data['token']
            username = request.data['username']
            cur_password = request.data['cur_password']
            new_password = request.data['new_password']
            if(username != "" and cur_password != "" and new_password != ""):
                res = manager.update_account(token, username, cur_password, new_password)
                if res['status']:
                    return Response({"response": res['response']}, status.HTTP_200_OK)
                return Response({"exception": res['exception']}, status.HTTP_400_BAD_REQUEST)
            return Response({"exception":"Необходимо указать имя пользователя и пароль"}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
 