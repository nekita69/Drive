from .views import * #Все импорты из views.py

#Админ Аккаунт контроллер;
class Transport(viewsets.ViewSet):
    @swagger_auto_schema(
        tags=['Transport'],
        operation_summary="Создание транспорта",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'canBeRented': openapi.Schema(type=openapi.TYPE_BOOLEAN, default=True),
                'transportType': openapi.Schema(type=openapi.TYPE_STRING),
                'model': openapi.Schema(type=openapi.TYPE_STRING),
                'color': openapi.Schema(type=openapi.TYPE_STRING),
                'identifier': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING, default=""),
                'latitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'longitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'minutePrice': openapi.Schema(type=openapi.TYPE_NUMBER, default=0.0),
                'dayPrice': openapi.Schema(type=openapi.TYPE_NUMBER, default=0.0),
            },
            required=['token', 'transportType', 'model', 'identifier']
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
    def create_transport(self, request):
        if request.method == "POST":
            token = request.data['token']
            about_tr = {
                'canBeRented':request.data['canBeRented'],
                'transportType':request.data['transportType'],
                'model':request.data['model'],
                'color':request.data['color'],
                'identifier':request.data['identifier'],
                'description':request.data['description'],
                'latitude':request.data['latitude'],
                'longitude':request.data['longitude'],
                'minutePrice':request.data['minutePrice'],
                'dayPrice':request.data['dayPrice'],
            }
            res = manager.create_transport(token, about_tr)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    


    @swagger_auto_schema(
        tags=['Transport'],
        operation_summary="Получение информации о транспорте",
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
    def get_transport_info(self, request, tr_id):
        if request.method == "GET":
            token = request.headers.get('token')
            res = manager.get_transport_info(token, tr_id)
            if res['status']:
                return Response({"transport":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        tags=['Transport'],
        operation_summary="Изменение транспорта",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'canBeRented': openapi.Schema(type=openapi.TYPE_BOOLEAN, default=True),
                'model': openapi.Schema(type=openapi.TYPE_STRING),
                'color': openapi.Schema(type=openapi.TYPE_STRING),
                'identifier': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING, default=""),
                'latitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'longitude': openapi.Schema(type=openapi.TYPE_NUMBER),
                'minutePrice': openapi.Schema(type=openapi.TYPE_NUMBER, default=0.0),
                'dayPrice': openapi.Schema(type=openapi.TYPE_NUMBER, default=0.0),
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
    def update_transport(self, request, tr_id):
        if request.method == "PUT":
            token = request.data['token']
            about_tr = {
                'canBeRented':request.data['canBeRented'],
                'model':request.data['model'],
                'color':request.data['color'],
                'identifier':request.data['identifier'],
                'description':request.data['description'],
                'latitude':request.data['latitude'],
                'longitude':request.data['longitude'],
                'minutePrice':request.data['minutePrice'],
                'dayPrice':request.data['dayPrice'],
            }
            res = manager.update_transport(token, tr_id, about_tr)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    


    @swagger_auto_schema(
        tags=['Transport'],
        operation_summary="Удаление транспорта",
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
    def delete_transport(self, request, tr_id):
        if request.method == "DELETE":
            token = request.data['token']
            res = manager.delete_transport(token, tr_id)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    


    @swagger_auto_schema(
        tags=['Transport'],
        operation_summary="Получение всего транспорта пользователя",
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
    def get_my_trnsp(self, request):
        if request.method == "GET":
            token = request.headers.get('token')
            res = manager.get_my_trnsp(token)
            if res['status']:
                return Response({"transport":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)