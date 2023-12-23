from .views import * #Все импорты из views.py

#Админ Аккаунт контроллер;
class AdminTransport(viewsets.ViewSet):
    @swagger_auto_schema(
        tags=['AdminTransport'],
        operation_summary="Получение выборки транспорта",
        manual_parameters=[
            openapi.Parameter('token', openapi.IN_HEADER, type=openapi.TYPE_STRING),
            openapi.Parameter('start', openapi.IN_HEADER, type=openapi.TYPE_STRING),
            openapi.Parameter('count', openapi.IN_HEADER, type=openapi.TYPE_STRING),
            openapi.Parameter('transportType', openapi.IN_HEADER, type=openapi.TYPE_STRING, default='all'),
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
    def admin_get_transports(self, request):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
                strs = request.headers.get('start')
                cnt = request.headers.get('count')
                tr_type = request.headers.get('transportType')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.admin_get_transports(token, strs, cnt, tr_type)
            if res['status']:
                return Response({"transports": res['response'] }, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)    
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
    

    @swagger_auto_schema(
        tags=['AdminTransport'],
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
    def admin_get_into_tf(self, request, tr_id):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.admin_get_info_transport(token, tr_id)
            if res['status']:
                return Response({"transports": res['response'] }, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)    
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST) 
    

    @swagger_auto_schema(
        tags=['AdminTransport'],
        operation_summary="Создание транспорта",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'owner_id': openapi.Schema(type=openapi.TYPE_INTEGER),
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
            required=['token', 'owner_id', 'transportType', 'model', 'identifier']
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
    def admin_create_transport(self, request):
        if request.method == "POST":
            token = request.data['token']
            owner_id = request.data['owner_id']
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
            res = manager.admin_create_transport(token, owner_id, about_tr)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST) 
    
    

    @swagger_auto_schema(
        tags=['AdminTransport'],
        operation_summary="Изменение транспорта",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'owner_id': openapi.Schema(type=openapi.TYPE_INTEGER, default=0),
                'transportType': openapi.Schema(type=openapi.TYPE_STRING, default=""),
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
    def admin_update_transport(self, request, tr_id):
        if request.method == "PUT":
            token = request.data['token']
            about_tr = {
                'owner_id':request.data['owner_id'],
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
            res = manager.admin_update_transport(token, tr_id, about_tr)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
    

    @swagger_auto_schema(
        tags=['AdminTransport'],
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
    def admin_delete_transport(self, request, tr_id):
        if request.method == "DELETE":
            token = request.data['token']
            res = manager.admin_delete_transport(token, tr_id)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST) 