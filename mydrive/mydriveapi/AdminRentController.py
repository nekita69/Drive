from .views import * #Все импорты из views.py

#Админ Аккаунт контроллер;
class AdminRent(viewsets.ViewSet):
    @swagger_auto_schema(
        tags=['AdminRent'],
        operation_summary="Получение информации о аренде",
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
    def admin_get_rent_info(self, request, rent_id):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.admin_get_rent_info(token, rent_id)
            if res['status']:
                return Response({"rent_info": res['response'] }, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    


    @swagger_auto_schema(
        tags=['AdminRent'],
        operation_summary="Получение истории аренд пользователя",
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
    def admin_get_rent_his_user(self, request, u_id):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.admin_get_rent_his_user(token, u_id)
            if res['status']:
                return Response({"rent_info": res['response'] }, status.HTTP_200_OK)    
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)


    @swagger_auto_schema(
        tags=['AdminRent'],
        operation_summary="Получение истории аренд транспорта",
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
    def admin_get_transport_rent_his(self, request, tr_id):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.admin_get_transport_rent_his(token, tr_id)
            if res['status']:
                return Response({"rent_info": res['response'] }, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)

    

    @swagger_auto_schema(
        tags=['AdminRent'],
        operation_summary="Создание аренды",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'user_id':openapi.Schema(type=openapi.TYPE_INTEGER),
                'tr_id':openapi.Schema(type=openapi.TYPE_INTEGER),
                'rent_type':openapi.Schema(type=openapi.TYPE_STRING, description='Доступные значения: минуты | день | 5 дней | 1 неделя | 2 недели'),
                'rent_point_start':openapi.Schema(type=openapi.TYPE_STRING),
                'rent_start':openapi.Schema(type=openapi.TYPE_STRING),
                'description':openapi.Schema(type=openapi.TYPE_STRING, default="")
            },
            required=['token', 'user_id', 'rent_type', 'lat', 'long', 'description']
        ),
        responses={
            201: openapi.Response(
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
            404: openapi.Response(
                description='BAD',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'exception': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
        }
    )
    def admin_create_rent(self, request):
        if request.method == "POST":
            token = request.data['token']
            u_id = request.data['user_id']
            tr_id = request.data['tr_id']
            rent_type = request.data['rent_type']
            rent_point_start = request.data['rent_point_start']
            rent_start = request.data['rent_start']
            descr = request.data['description']
            res = manager.admin_create_rent(token, u_id, tr_id, rent_type, rent_point_start, rent_start, descr)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_201_CREATED)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_404_NOT_FOUND) 



    @swagger_auto_schema(
        tags=['AdminRent'],
        operation_summary="Завершение аренды",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'rent_point_finish': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['token', 'rent_point_finish']
        ),
        responses={
            201: openapi.Response(
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
            404: openapi.Response(
                description='BAD',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'exception': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
        }
    )
    def admin_delete_rent(self, request, rent_id):
        if request.method == "POST":
            token = request.data['token']
            rent_point_finish = request.data['rent_point_finish']
            res = manager.admin_delete_rent(token, rent_id, rent_point_finish)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_201_CREATED)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_404_NOT_FOUND) 
    

    @swagger_auto_schema(
        tags=['AdminRent'],
        operation_summary="Удаление записи о аренде",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=['token']
        ),
        responses={
            201: openapi.Response(
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
            404: openapi.Response(
                description='BAD',
                schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'exception': openapi.Schema(type=openapi.TYPE_STRING)},
                )
            ),
        }
    )
    def admin_rent_delete(self, request, rent_id):
        if request.method == "DELETE":
            token = request.data['token']
            res = manager.admin_rent_delete(token, rent_id)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_201_CREATED)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_404_NOT_FOUND) 
    



    @swagger_auto_schema(
        tags=['AdminRent'],
        operation_summary="Получение действующих аренд пользователя",
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
    def get_curr_rent_user(self, request, u_id):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            res = manager.get_curr_rent_user(token, u_id)
            if res['status']:
                return Response({"cur_rents": res['response'] }, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)



