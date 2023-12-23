from .views import * #Все импорты из views.py

#Админ Аккаунт контроллер;
class Rent(viewsets.ViewSet):
    @swagger_auto_schema(
        tags=['Rent'],
        operation_summary="Получение транспорта доступного для аренды",
        manual_parameters=[
            openapi.Parameter('token', openapi.IN_HEADER, type=openapi.TYPE_STRING),
            openapi.Parameter('lat', openapi.IN_HEADER, type=openapi.TYPE_NUMBER),
            openapi.Parameter('long', openapi.IN_HEADER, type=openapi.TYPE_NUMBER),
            openapi.Parameter('radius', openapi.IN_HEADER, type=openapi.TYPE_NUMBER, default=0.5),
            openapi.Parameter('type', openapi.IN_HEADER, type=openapi.TYPE_STRING, default="all"),
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
    def get_transport_for_rent(self, request):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
                lat = request.headers.get('lat')
                lng = request.headers.get('long')
                radius = request.headers.get('radius')
                tr_type = request.headers.get('type')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.get_transport_for_rent(token, lat, lng, radius, tr_type)
            if res['status']:
                return Response({"transports_for_rents":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        tags=['Rent'],
        operation_summary="Получение транспорта доступного для аренды, расширенный",
        manual_parameters=[
            openapi.Parameter('token', openapi.IN_HEADER, type=openapi.TYPE_STRING),
            openapi.Parameter('lat', openapi.IN_HEADER, type=openapi.TYPE_NUMBER),
            openapi.Parameter('long', openapi.IN_HEADER, type=openapi.TYPE_NUMBER),
            openapi.Parameter('radius', openapi.IN_HEADER, type=openapi.TYPE_NUMBER, default=0.5),
            openapi.Parameter('type', openapi.IN_HEADER, type=openapi.TYPE_STRING, default="all"),
            openapi.Parameter('price', openapi.IN_HEADER, type=openapi.TYPE_STRING, default="dayPrice"),
            openapi.Parameter('pmin', openapi.IN_HEADER, type=openapi.TYPE_NUMBER, default=0),
            openapi.Parameter('pmax', openapi.IN_HEADER, type=openapi.TYPE_NUMBER, default=10000),
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
    def get_transport_for_rent2(self, request):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
                lat = request.headers.get('lat')
                lng = request.headers.get('long')
                radius = request.headers.get('radius')
                tr_type = request.headers.get('type')
                price = request.headers.get('price')
                pmin = request.headers.get('pmin')
                pmax = request.headers.get('pmax')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.get_transport_for_rent2(token, lat, lng, radius, price, pmin, pmax, tr_type)
            if res['status']:
                return Response({"transports_for_rents":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)

    
    @swagger_auto_schema(
        tags=['Rent'],
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
    def get_rent_info(self, request, rent_id):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.get_rent_info(token, rent_id)
            if res['status']:
                return Response({"rent_info":res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)
    

    @swagger_auto_schema(
        tags=['Rent'],
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
    def get_my_rents(self, request):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            res = manager.get_my_rents(token)
            if res['status']:
                return Response({"my_rents": res['response'] }, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)


    @swagger_auto_schema(
        tags=['Rent'],
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
    def get_rent_his(self, request):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.get_rent_history(token)
            if res['status']:
                return Response({"rent_info": res['response'] }, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)   



    @swagger_auto_schema(
        tags=['Rent'],
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
    def get_transport_rent_his(self, request, tr_id):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.get_transport_rent_his(token, tr_id)
            if res['status']:
                return Response({"rent_info": res['response']}, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST) 
    


    @swagger_auto_schema(
        tags=['Rent'],
        operation_summary="Создание аренды",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'rent_type':openapi.Schema(type=openapi.TYPE_STRING, description='Доступные значения: минуты | день | 5 дней | 1 неделя | 2 недели'),
                'position':openapi.Schema(type=openapi.TYPE_STRING),
                'timestart':openapi.Schema(type=openapi.TYPE_NUMBER),
                'description':openapi.Schema(type=openapi.TYPE_STRING, default="")
            },
            required=['token', 'rent_type', 'lat', 'long', 'description']
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
    def create_rent(self, request, tr_id):
        if request.method == "POST":
            token = request.data['token']
            rent_type = request.data['rent_type']
            rent_point_start = request.data['position']
            rent_time_start = request.data['timestart']
            descr = request.data['description']
            res = manager.create_rent(token, tr_id, rent_type, rent_point_start, rent_time_start, descr)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_201_CREATED)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_404_NOT_FOUND) 
    


    @swagger_auto_schema(
        tags=['Rent'],
        operation_summary="Завершение аренды",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'token': openapi.Schema(type=openapi.TYPE_STRING),
                'lat': openapi.Schema(type=openapi.TYPE_NUMBER),
                'long': openapi.Schema(type=openapi.TYPE_NUMBER),
            },
            required=['token', 'lat', 'long']
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
    def delete_rent(self, request, rent_id):
        if request.method == "POST":
            token = request.data['token']
            rent_point_finish = request.data['rent_point_finish']
            res = manager.delete_rent(token, rent_id,  rent_point_finish)
            if res['status']:
                return Response({"response":res['response']}, status.HTTP_201_CREATED)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_404_NOT_FOUND) 
    

    @swagger_auto_schema(
        tags=['Rent'],
        operation_summary="Получение пунктов аренды ТС",
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
    def get_rent_points(self, request):
        if request.method == "GET":
            try:
                token  = request.headers.get('token')
            except:
                return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)  
            
            res = manager.get_rent_points(token)
            if res['status']:
                return Response({"rent_points": res['response'] }, status.HTTP_200_OK)
            return Response({"exception":res['exception']}, status.HTTP_400_BAD_REQUEST)
        return Response({"exception":"Неверный запрос"}, status.HTTP_400_BAD_REQUEST)   