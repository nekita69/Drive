import psycopg2
from datetime import datetime
import jwt


#Порт и хост сервера на котором расположена БД;
HOST_DB = 'localhost'
PORT_DB = '5432'
DB_NAME = 'drv_db' #Имя БД
USER = 'postgres' #Пользователь который работает с БД (в СУБД)
DB_PASS = '123451515' #Пароль от пользователя


SECRET_KEY = 'Hsgdjagsa62742jsfjEWgMSagsa3927427ODPBWHdftefqywge'


class Manager:
    def __init__(self):
        self.connect = psycopg2.connect(host=HOST_DB, port=PORT_DB, dbname = DB_NAME , user= USER, password= DB_PASS)
        self.cursor = self.connect.cursor()
        
        with open('mydriveapi/init_db.sql', 'r', encoding='utf-8') as file:
            sql_script = file.read()
        self.cursor.execute(sql_script)
        self.connect.commit()


    def __del__(self): #Деструктор
        self.connect.commit()
        self.connect.close()

    # ||||||||||||||||||| for AccountController |||||||||||||||||||

    #Создание пользователя +
    def signup(self, username, password):
        if(username != "" and password != ''):
            try:
                self.cursor.execute("SELECT create_user(%s, %s)", (username, password))        
            except psycopg2.Error as e:
                self.connect.rollback()
                error_mess = e.pgerror #Сообщение об ошибке, возникщей на сервере БД;
                error_mess = error_mess.split("\n")[0]
                print(error_mess)
                return {"status":False, "exception":error_mess}
            else:
                self.connect.commit()
                return {"status":True, "response":'Аккаунт создан'}
        return {"status":False, "exception":'Введите имя пользователя и пароль'}
    

    #Авторизация пользователя +
    def signin(self, username, password):
        self.cursor.execute("SELECT user_id, is_admin FROM users WHERE LOWER(username) = LOWER(%s) AND password = %s", (username, password))
        res = self.cursor.fetchone()
        if res != None:
            payload = {'user_id':res[0], 'is_admin':res[1]}
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            return token 
        return None #Аккаунт не найден

    #Валидация токена +
    def is_tokenvalid(self, token):
        try:
            payload = jwt.decode(token, SECRET_KEY)
        except: #Если возникает ошибка при декодировании токена - токен недействительный
            return False
        
        if(payload['user_id'] != None and payload['is_admin'] != None):
            return True
        return False

    #Получение id аккаунта из payload +
    def get_id_in_token(self, token):
        try:
            payload = jwt.decode(token, SECRET_KEY)
        except: #Если возникает ошибка при декодировании токена - токен недействительный
            return None
        return payload['user_id']


    #Получение информации об аккаунте +
    def get_account(self, token):
        user_id = self.get_id_in_token(token)
        if user_id == None:
            return None #Если токен не валидный
        self.cursor.execute(f"SELECT user_id, username, password, is_admin, balance FROM users WHERE user_id = {user_id}")
        res = self.cursor.fetchone()
        return {'user_id': res[0], 'username': res[1], 'password': res[2], 'is_admin':res[3], 'balance': float(res[4])}


    #Обновление аккаунта +
    def update_account(self, token, username, cur_password, new_password):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            if(username != "" and cur_password != "" and new_password != ""):
                try:
                    self.cursor.execute("SELECT update_user(%s, %s, %s, %s)", (user_id, username, cur_password, new_password))
                except psycopg2.Error as e:
                    self.connect.rollback() #Откатываем транзакцию
                    error_mess = e.pgerror #Сообщение об ошибке, возникщей на сервере БД;
                    error_mess = error_mess.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Данные обновлены'}
        return {"status":False, "exception":'Необходимо авторизоваться'}

    # ||||||||||||||||||| for AdminAccountController |||||||||||||||||||

    #Проверка на администратора +
    def is_admin(self, token):
        try:
            payload = jwt.decode(token, SECRET_KEY)
        except: #Если возникает ошибка при декодировании токена - токен недействительный
            return False
        
        if(payload['user_id'] != None and payload['is_admin'] != None):
            return payload['is_admin']
        return False


    #Получение выборки аккаунтов, администратором (начало выборки, количество выборки) +
    def admin_get_accounts(self, token, strt, cnt):
        if self.is_tokenvalid(token):
            if strt == '':
                strt = 0
            if cnt == '':
                cnt = 30
            if self.is_admin(token):
                self.cursor.execute("SELECT * FROM users LIMIT %s OFFSET %s;", (cnt, strt))
                res = self.cursor.fetchone()
                users = []
                while res != None:
                    users.append({
                        'user_id':res[0],
                        'username':res[1],
                        'password':res[2],
                        'is_admin':res[3],
                        'balance':float(res[4])
                        })
                    res = self.cursor.fetchone()
                return {"status":True, "response": users }
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Получение информации о аккаунте по id +
    def admin_get_acc(self, token, id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                self.cursor.execute(f"SELECT * FROM users WHERE user_id = {id};")
                res = self.cursor.fetchone()
                if res == None:
                    return {"status":False, "exception":'Аккаунт не найден'}
                result = {'user_id':res[0], 'username':res[1], 'password':res[2], 'is_admin':res[3], 'balance':float(res[4])}
                return {"status":True, "response":result}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    

    #Создание аккаунта администратором +
    def admin_create_account(self, token, username, password, is_admin, balance):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                try:
                    self.cursor.execute("SELECT admin_create_account(%s, %s, %s, %s);", (username, password, is_admin, balance))
                except psycopg2.Error as e:
                    self.connect.rollback() #Откатываем транзакцию
                    error_mess = e.pgerror.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Аккаунт создан'}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Обновление аккаунта администратором +
    def admin_update_account(self, token, u_id, username, password, is_admin, balance):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                try:
                    self.cursor.execute("SELECT admin_update_account(%s, %s, %s, %s, %s);", (u_id, username, password, is_admin, balance))
                except psycopg2.Error as e:
                    self.connect.rollback() 
                    error_mess = e.pgerror.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Аккаунт обновлен'}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    

    #Удаление аккаунта администратором
    def admin_delete_account(self, token, u_id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                try:
                    self.cursor.execute(f"DELETE FROM users WHERE user_id = {u_id};")
                except psycopg2.Error as e:
                    self.connect.rollback() 
                    error_mess = e.pgerror.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Пользователь удален'}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    

    # ||||||||||||||||||| for TransportController |||||||||||||||||||
    

    #Добавление ТС + 
    def create_transport(self, token, about_trsp): #Токен и словарь с данными о ТС
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            try:
                self.cursor.execute("SELECT create_transport(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",(user_id, about_trsp['canBeRented'], about_trsp['transportType'], about_trsp['model'], about_trsp['color'], about_trsp['identifier'], about_trsp['description'], about_trsp['latitude'], about_trsp['longitude'], about_trsp['minutePrice'], about_trsp['dayPrice']))
            except psycopg2.Error as e:
                self.connect.rollback() 
                error_mess = e.pgerror.split("\n")[0]
                return {"status":False, "exception":error_mess}
            else:
                self.connect.commit()
                return {"status":True, "response":'Транспорт создан'}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    

    #Получение информации о ТС по ID +
    def get_transport_info(self, token, tr_id):
        if self.is_tokenvalid(token):
            self.cursor.execute(f"SELECT canBeRented, transportType, model, color, identifier, description, latitude, longitude, minutePrice, dayPrice, rent_point.name FROM transports, rent_point WHERE trnsp_id = {tr_id} AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005);")
            res = self.cursor.fetchone()
            if res == None:
                return {"status":False, "exception":'Транспорт не найден'}
            tr = {
                "canBeRented":res[0],
                "transportType":res[1],
                "model":res[2],
                "color":res[3],
                "identifier":res[4],
                "description":res[5],
                "latitude":res[6],
                "longitude":res[7],
                "minutePrice":res[8],
                "dayPrice":res[9],
                'position':res[10]
                }
            return {"status":True, "response":tr}
        return {"status":False, "exception":'Необходимо авторизоваться'} 


    #Обновление ТС, для владельца; +
    def update_transport(self, token, tr_id, about_tr):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            try:
                self.cursor.execute("SELECT update_transport(%s, %s,  %s, %s, %s, %s, %s, %s, %s, %s, %s)", (user_id, tr_id, about_tr['canBeRented'],
                                                                                                                        about_tr['model'],
                                                                                                                        about_tr['color'],
                                                                                                                        about_tr['identifier'],
                                                                                                                        about_tr['description'],
                                                                                                                        about_tr['latitude'],
                                                                                                                        about_tr['longitude'],
                                                                                                                        about_tr['minutePrice'],
                                                                                                                        about_tr['dayPrice']))
            except psycopg2.Error as e:
                self.connect.rollback() 
                error_mess = e.pgerror.split("\n")[0]
                return {"status":False, "exception":error_mess}
            else:
                self.connect.commit()
                return {"status":True, "response":"Транспорт обновлен"}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Удаление ТС, для владельца
    def delete_transport(self, token, tr_id):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            try:
                self.cursor.execute("DELETE FROM transports WHERE trnsp_id = %s AND owner_id = %s;", (tr_id, user_id))
            except psycopg2.Error as e:
                self.connect.rollback() 
                error_mess = e.pgerror.split("\n")[0]
                return {"status":False, "exception":error_mess}
            else:
                self.connect.commit()
                return {"status":True, "response":"Транспорт удален"}
        return {"status":False, "exception":'Необходимо авторизоваться'}

    #Получение списка всего транспорта пользователя;
    def get_my_trnsp(self, token):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            self.cursor.execute(f"SELECT trnsp_id, canBeRented, transportType, model, color, identifier, description, latitude, longitude, minutePrice, dayPrice, rent_point.name FROM transports, rent_point WHERE owner_id = {user_id} AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005);")
            res = self.cursor.fetchone()
            rez_list = []
            while res != None:
                rez_list.append({
                    "trnsp_id":res[0],
                    "canBeRented":res[1],
                    "transportType":res[2],
                    "model":res[3],
                    "color":res[4],
                    "identifier":res[5],
                    "description":res[6],
                    "latitude":res[7],
                    "longitude":res[8],
                    "minutePrice":res[9],
                    "dayPrice":res[10],
                    'position':res[11]
                })
                res = self.cursor.fetchone()
            return {"status":True, "response":rez_list}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    # ||||||||||||||||||| for AdminTransportController |||||||||||||||||||
    
    
    #Получение выборки ТС +
    def admin_get_transports(self, token, strs, cnt, tr_type):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                if tr_type.lower() == "all":
                    self.cursor.execute("SELECT *, rent_point.name FROM transports, rent_point WHERE (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005) LIMIT %s OFFSET %s;", (cnt, strs))
                else:
                    t_type = ''
                    if tr_type.lower() == 'car':
                        t_type = 'Автомобиль'
                    elif tr_type.lower() == 'bike':
                        t_type = 'Мотоцикл'
                    else:
                        t_type = 'Самокат'
                    self.cursor.execute("SELECT *, rent_point.name FROM transports, rent_point WHERE LOWER(transporttype) = LOWER(%s) AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005) LIMIT %s OFFSET %s;", (t_type, cnt, strs))
                res = self.cursor.fetchone()
                tr_list = []
                while res != None:
                    tr_list.append({
                    "trnsp_id":res[0],"owner_id":res[1],"canBeRented":res[2],"transportType":res[3],"model":res[4],"color":res[5],
                    "identifier":res[6],"description":res[7],"latitude":res[8],"longitude":res[9],"minutePrice":res[10],
                    "dayPrice":res[11], 'position':res[13]
                    })
                    res = self.cursor.fetchone()
                
                return {"status":True, "response":tr_list}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    

    #Получение информации о ТС по ID. +
    def admin_get_info_transport(self, token, tr_id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                self.cursor.execute(f"SELECT *, rent_point.name FROM transports, rent_point WHERE trnsp_id = {tr_id} AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005);")
                res = self.cursor.fetchone()
                if res == None:
                    return {"status":False, "exception":'Транспорт не найден'}
                tr = {
                    "trnsp_id":res[0],
                    "owner_id":res[1],
                    "canBeRented":res[2],
                    "transportType":res[3],
                    "model":res[4],
                    "color":res[5],
                    "identifier":res[6],
                    "description":res[7],
                    "latitude":res[8],
                    "longitude":res[9],
                    "minutePrice":res[10],
                    "dayPrice":res[11],
                    "position":res[13]
                }
                return {"status":True, "response":tr}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    

    #Создание ТС администратором; +
    def admin_create_transport(self, token, u_id, about_trsp):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                try:
                    self.cursor.execute("SELECT create_transport(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",(u_id, about_trsp['canBeRented'], about_trsp['transportType'], about_trsp['model'], about_trsp['color'], about_trsp['identifier'], about_trsp['description'], about_trsp['latitude'], about_trsp['longitude'], about_trsp['minutePrice'], about_trsp['dayPrice']))
                except psycopg2.Error as e:
                    self.connect.rollback() 
                    error_mess = e.pgerror.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Транспорт создан'}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Изменение ТС по id, администратором; +
    def admin_update_transport(self, token, tr_id, about_tr):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                try:
                    self.cursor.execute("SELECT admin_update_transport(%s, %s, %s,  %s, %s, %s, %s, %s, %s, %s, %s, %s)", (tr_id, about_tr['owner_id'], 
                                                                                                                        about_tr['canBeRented'],
                                                                                                                        about_tr['transportType'],
                                                                                                                        about_tr['model'],
                                                                                                                        about_tr['color'],
                                                                                                                        about_tr['identifier'],
                                                                                                                        about_tr['description'],
                                                                                                                        about_tr['latitude'],
                                                                                                                        about_tr['longitude'],
                                                                                                                        about_tr['minutePrice'],
                                                                                                                        about_tr['dayPrice']))
                except psycopg2.Error as e:
                    self.connect.rollback() 
                    error_mess = e.pgerror.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Данные обновлены'}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    
    
    #Удаление ТС по id администратором
    def admin_delete_transport(self, token, tr_id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                try:
                    self.cursor.execute(f"DELETE FROM transports WHERE trnsp_id = {tr_id};")
                except psycopg2.Error as e:
                    self.connect.rollback() 
                    error_mess = e.pgerror.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Транспорт удален'}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    # ||||||||||||||||||| for RentController |||||||||||||||||||

    #Транспорт доступный для аренды; +
    def get_transport_for_rent(self, token, lat, lng, radius, tr_type = 'all'):
        if self.is_tokenvalid(token):
            if lat == '':
                lat = 0
            if lng == '':
                lng = 0
            if radius == '':
                radius = 0

            if tr_type.lower() == 'all': #Весь транспорт
                self.cursor.execute("SELECT *, rent_point.name FROM transports, rent_point WHERE canBeRented = 'true' AND (latitude BETWEEN %s AND %s) AND (longitude BETWEEN %s AND %s) AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005);", (float(lat)-float(radius), float(lat)+float(radius), float(lng)-float(radius), float(lng)+float(radius)))
            else: #выбор типа транспорта 
                t_type = ''
                if tr_type.lower() == 'car':
                    t_type = 'автомобиль'
                elif tr_type.lower() == 'bike':
                    t_type = 'мотоцикл'
                else:
                    t_type = 'самокат'

                self.cursor.execute("SELECT *, rent_point.name FROM transports, rent_point WHERE canBeRented = 'true' AND (latitude BETWEEN %s AND %s) AND (longitude BETWEEN %s AND %s) AND transportType = %s AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005);", (float(lat)-float(radius), float(lat)+float(radius), float(lng)-float(radius), float(lng)+float(radius), t_type))
            res = self.cursor.fetchone()
            tr_list = []
            while res != None:
                #print(res)
                tr_list.append({
                    "trnsp_id":res[0],
                    "canBeRented":res[2],
                    "transportType":res[3],
                    "model":res[4],
                    "color":res[5],
                    "identifier":res[6],
                    "description":res[7],
                    "latitude":res[8],
                    "longitude":res[9],
                    "minutePrice":res[10],
                    "dayPrice":res[11],
                    'position':res[13]
                })
                res = self.cursor.fetchone()
            return {"status":True, "response":tr_list}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    

    #Транспорт доступный для аренды, рассширенный
    def get_transport_for_rent2(self, token, lat, lng, radius, price, pmin, pmax, tr_type = 'all'):
        if self.is_tokenvalid(token):
            if lat == '':
                lat = 0
            if lng == '':
                lng = 0
            if radius == '':
                radius = 0

            if(price == ''):
                price = 'dayPrice'

            if(pmin == ''):
                pmin = 0
            if(pmax == ''):
                pmax = 20000

            if tr_type.lower() == 'all': #Весь транспорт
                if(price == 'dayPrice'):
                    self.cursor.execute("SELECT *, rent_point.name FROM transports, rent_point WHERE canBeRented = 'true' AND (latitude BETWEEN %s AND %s) AND (longitude BETWEEN %s AND %s) AND (dayPrice BETWEEN %s AND %s) AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005)", (float(lat)-float(radius), float(lat)+float(radius), float(lng)-float(radius), float(lng)+float(radius), pmin, pmax))
                else:
                    self.cursor.execute("SELECT *, rent_point.name FROM transports, rent_point WHERE canBeRented = 'true' AND (latitude BETWEEN %s AND %s) AND (longitude BETWEEN %s AND %s) AND (minutePrice BETWEEN %s AND %s) AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005)", (float(lat)-float(radius), float(lat)+float(radius), float(lng)-float(radius), float(lng)+float(radius), pmin, pmax))
            else: #выбор типа транспорта 
                t_type = ''
                if tr_type.lower() == 'car':
                    t_type = 'автомобиль'
                elif tr_type.lower() == 'bike':
                    t_type = 'мотоцикл'
                else:
                    t_type = 'самокат'


                if(price == 'dayPrice'):
                    self.cursor.execute("SELECT *, rent_point.name FROM transports, rent_point WHERE canBeRented = 'true' AND (latitude BETWEEN %s AND %s) AND (longitude BETWEEN %s AND %s) AND transportType = %s AND (dayPrice BETWEEN %s AND %s) AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005)", (float(lat)-float(radius), float(lat)+float(radius), float(lng)-float(radius), float(lng)+float(radius), t_type, pmin, pmax))
                else:
                    self.cursor.execute("SELECT *, rent_point.name FROM transports, rent_point WHERE canBeRented = 'true' AND (latitude BETWEEN %s AND %s) AND (longitude BETWEEN %s AND %s) AND transportType = %s AND (minutePrice BETWEEN %s AND %s) AND (latitude BETWEEN lat - 0.00005 AND lat + 0.00005) AND (longitude BETWEEN long - 0.00005 AND long + 0.00005)", (float(lat)-float(radius), float(lat)+float(radius), float(lng)-float(radius), float(lng)+float(radius), t_type, pmin, pmax))
            res = self.cursor.fetchone()
            tr_list = []
            while res != None:
                tr_list.append({
                    "trnsp_id":res[0],
                    "canBeRented":res[2],
                    "transportType":res[3],
                    "model":res[4],
                    "color":res[5],
                    "identifier":res[6],
                    "description":res[7],
                    "latitude":res[8],
                    "longitude":res[9],
                    "minutePrice":res[10],
                    "dayPrice":res[11],
                    "position":res[13]
                })
                res = self.cursor.fetchone()
            return {"status":True, "response":tr_list}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Получение действующих аренд текущего аккаунта +
    def get_my_rents(self, token):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            self.cursor.execute(f"SELECT rent_id, trnsp_id, renttype, rentprice, description, rent_point_start, rent_point_finish, rent_start FROM rents WHERE user_id = {user_id} AND rent_finish is null;")
            res = self.cursor.fetchone()
            rent_list = []
            while res != None:

                srent = str(res[7])

                rent_list.append({
                "rent_id":res[0],
                "trnsp_id":res[1],
                "renttype":res[2],
                "rentprice":res[3],
                "description":res[4],
                "rent_point_start":res[5],
                "rent_point_finish":res[6],
                "rent_start":srent,
                })
                res = self.cursor.fetchone()
            return {"status":True, "response":rent_list}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Получение информации о аренде по ID аренды (для владельца или кто арендует) +
    def get_rent_info(self, token, rent_id):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            self.cursor.execute("SELECT * FROM rents WHERE rent_id = %s AND user_id = %s", (rent_id, user_id))
            res = self.cursor.fetchone()
            if res == None:
                return {"status":False, "exception":'Вы не являетесь арендатором'}
            rent = {
                "rent_id":res[0],
                "user_id":res[1],
                "trnsp_id":res[2],
                "renttype":res[3],
                "rentprice":res[4],
                "description":res[5],
                "rent_point_start":res[6],
                "rent_point_finish":res[7],
                "rent_start":res[8],
                "rent_finish":res[9]
            }
            return {"status":True, "response":rent}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Получение истории аренд текущего аккаунта; +
    def get_rent_history(self, token):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            self.cursor.execute(f"SELECT rent_id, user_id, trnsp_id, renttype, rentprice, description, rent_point_start, rent_point_finish, rent_start, rent_finish FROM his_rents WHERE user_id = {user_id};")
            res = self.cursor.fetchone()
            rez_list = []
            while res != None:

                strez = str(res[8])
                fsrez = str(res[9])

                rez_list.append({
                    "rent_id":res[0], 
                    "user_id":res[1], 
                    "trnsp_id":res[2], 
                    "renttype":res[3], 
                    "rentprice":res[4], 
                    "description":res[5], 
                    "rent_point_start":res[6], 
                    "rent_point_finish":res[7], 
                    "rent_start ":strez,  
                    "rent_finish":fsrez
                })
                res = self.cursor.fetchone()

            self.cursor.execute(f"SELECT * FROM rents WHERE user_id = {user_id} AND rent_finish IS not null;")
            res1 = self.cursor.fetchone()
            while res1 != None:
                strez = str(res1[8])
                fsrez = str(res1[9])

                rez_list.append({
                    "rent_id":res1[0], 
                    "user_id":res1[1], 
                    "trnsp_id":res1[2], 
                    "renttype":res1[3], 
                    "rentprice":res1[4], 
                    "description":res1[5], 
                    "rent_point_start":res1[6], 
                    "rent_point_finish":res1[7], 
                    "rent_start ":strez,  
                    "rent_finish":fsrez
                })
                res1 = self.cursor.fetchone()
            return {"status":True, "response":rez_list}
        return {"status":False, "exception":'Необходимо авторизоваться'}



    #Получение истории аренд транспорта +
    def get_transport_rent_his(self, token, tr_id):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            self.cursor.execute("SELECT COUNT(*) FROM transports WHERE trnsp_id = %s AND owner_id = %s;", (tr_id, user_id))
            res = self.cursor.fetchone()[0]
            if res == 0:
                return {"status":False, "exception":'Вы не являетесь владельцем ТС'}

            
            self.cursor.execute(f"SELECT rent_id, user_id, trnsp_id, renttype, rentprice, description, rent_point_start, rent_point_finish, rent_start, rent_finish FROM his_rents WHERE trnsp_id = {tr_id};")
            res1 = self.cursor.fetchone()
            rez_list = []
            while res1 != None:

                strez = str(res1[8])
                fsrez = str(res1[9])

                rez_list.append({
                    "rent_id":res1[0], 
                    "user_id":res1[1], 
                    "trnsp_id":res1[2], 
                    "renttype":res1[3], 
                    "rentprice":res1[4], 
                    "description":res1[5], 
                    "rent_point_start":res1[6], 
                    "rent_point_finish":res1[7], 
                    "rent_start ":strez,  
                    "rent_finish":fsrez
                })
                res1 = self.cursor.fetchone()

            self.cursor.execute(f"SELECT * FROM rents WHERE trnsp_id = {tr_id} AND rent_finish IS not null;")
            res2 = self.cursor.fetchone()
            while res2 != None:

                strez = str(res2[8])
                fsrez = str(res2[9])

                rez_list.append({
                    "rent_id":res2[0], 
                    "user_id":res2[1], 
                    "trnsp_id":res2[2], 
                    "renttype":res2[3], 
                    "rentprice":res2[4], 
                    "description":res2[5], 
                    "rent_point_start":res2[6], 
                    "rent_point_finish":res2[7], 
                    "rent_start ":strez,  
                    "rent_finish":fsrez
                })
                res2 = self.cursor.fetchone()
            return {"status":True, "response":rez_list}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Создание новой аренды для текущего аккаунта; +
    def create_rent(self, token, tr_id, rent_type, rent_point_start, rent_time_start, descr = ""):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            try:
                self.cursor.execute("SELECT create_rent(%s, %s, %s, %s, %s, %s);", (user_id, tr_id, rent_type, rent_point_start, rent_time_start, descr))
            except psycopg2.Error as e:
                self.connect.rollback() 
                error_mess = e.pgerror.split("\n")[0]
                return {"status":False, "exception":error_mess}
            else:
                self.connect.commit()
                return {"status":True, "response":'Аренда создана'}
        return {"status":False, "exception":'Необходимо авторизоваться'}



    #Завершение аренды (пользователь, который арендует) +
    def delete_rent(self, token, rent_id, rent_point_finish):
        if self.is_tokenvalid(token):
            user_id = self.get_id_in_token(token)
            try:
                self.cursor.execute("SELECT delete_rent(%s, %s, %s);", (rent_id, user_id, rent_point_finish))
            except psycopg2.Error as e:
                self.connect.rollback() 
                error_mess = e.pgerror.split("\n")[0]
                return {"status":False, "exception":error_mess}
            else:
                self.connect.commit()
                return {"status":True, "response":'Аренда завершена'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Получение пунктов аренды ТС
    def get_rent_points(self, token):
        if self.is_tokenvalid(token):
            self.cursor.execute("SELECT * FROM rent_point")
            res = []
            rest = self.cursor.fetchone()
            while rest != None:
                res.append({
                    'id':rest[0],
                    'name':rest[1],
                    'lat':rest[2],
                    'long':rest[3]
                })
                rest = self.cursor.fetchone()
            if(len(res) == 0): 
                return {"status":False, "exception":'Пункты аренды не найдены'}
            return {"status":True, "response":res}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    # ||||||||||||||||||| for AdminRentController |||||||||||||||||||

    #Получение информации об аренде по id +
    def admin_get_rent_info(self, token, rent_id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                self.cursor.execute(f"SELECT * FROM rents WHERE rent_id = {rent_id};")
                res1 = self.cursor.fetchone()
                if res1 != None:

                    strez = str(res1[8])
                    fsrez = str(res1[9])


                    rent = {
                        "rent_id":res1[0], 
                        "user_id":res1[1], 
                        "trnsp_id":res1[2], 
                        "renttype":res1[3], 
                        "rentprice":res1[4], 
                        "description":res1[5], 
                        "rent_point_start":res1[6], 
                        "rent_point_finish":res1[7], 
                        "rent_start ":strez,  
                        "rent_finish":fsrez
                        }
                    return {"status":True, "response":rent}
                return {"status":False, "exception":'Аренда не найдена'}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}
    

    #Получение истории аренд пользователя, для админа; +
    def admin_get_rent_his_user(self, token, user_id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                self.cursor.execute(f"SELECT rent_id, user_id, trnsp_id, renttype, rentprice, description, rent_point_start, rent_point_finish, rent_start, rent_finish FROM his_rents WHERE user_id = {user_id};")
                res = self.cursor.fetchone()
                rez_list = []
                while res != None:
                    strez = str(res[8])
                    fsrez = str(res[9])

                    rez_list.append({
                        "rent_id":res[0], "user_id":res[1],  "trnsp_id":res[2], "renttype":res[3], "rentprice":res[4], "description":res[5], 
                        "rent_point_start":res[6], "rent_point_finish":res[7], "rent_start ":strez, "rent_finish":fsrez
                    })
                    res = self.cursor.fetchone()

                self.cursor.execute(f"SELECT * FROM rents WHERE user_id = {user_id} AND rent_finish IS not null;")
                res1 = self.cursor.fetchone()
                while res1 != None:
                    strez = str(res1[8])
                    fsrez = str(res1[9])

                    rez_list.append({
                        "rent_id":res1[0], "user_id":res1[1], "trnsp_id":res1[2], "renttype":res1[3], "rentprice":res1[4], "description":res1[5], 
                        "rent_point_start":res1[6], "rent_point_finish":res1[7], "rent_start ":strez,  "rent_finish":fsrez
                    })
                    res1 = self.cursor.fetchone()
                if(len(rez_list) ==  0):
                    return {"status":False, "exception":'У пользователя отсутствуют аренды'}
                return {"status":True, "response":rez_list}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Получение истории аренд транспорта по ID; +
    def admin_get_transport_rent_his(self, token, tr_id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                self.cursor.execute(f"SELECT COUNT(*) FROM transports WHERE trnsp_id = {tr_id};")
                res = self.cursor.fetchone()[0]
                if res == 0:
                    return {"status":False, "exception":'Транспорт не найден'}
                
                self.cursor.execute(f"SELECT rent_id, user_id, trnsp_id, renttype, rentprice, description, rent_point_start, rent_point_finish, rent_start, rent_finish FROM his_rents WHERE trnsp_id = {tr_id};")
                res1 = self.cursor.fetchone()
                rez_list = []
                while res1 != None:
                    strez = str(res1[8])
                    fsrez = str(res1[9])

                    rez_list.append({
                        "rent_id":res1[0], 
                        "user_id":res1[1], 
                        "trnsp_id":res1[2], 
                        "renttype":res1[3], 
                        "rentprice":res1[4], 
                        "description":res1[5], 
                        "rent_point_start":res1[6], 
                        "rent_point_finish":res1[7], 
                        "rent_start ":strez,  
                        "rent_finish":fsrez
                    })
                    res1 = self.cursor.fetchone()

                self.cursor.execute(f"SELECT * FROM rents WHERE trnsp_id = {tr_id} AND rent_finish IS not null;")
                res2 = self.cursor.fetchone()
                while res2 != None:
                    strez = str(res2[8])
                    fsrez = str(res2[9])

                    rez_list.append({
                        "rent_id":res2[0], 
                        "user_id":res2[1], 
                        "trnsp_id":res2[2], 
                        "renttype":res2[3], 
                        "rentprice":res2[4], 
                        "description":res2[5], 
                        "rent_point_start":res2[6], 
                        "rent_point_finish":res2[7], 
                        "rent_start ":strez,  
                        "rent_finish":fsrez
                    })
                    res2 = self.cursor.fetchone()
                if(len(rez_list) == 0):
                    return {"status":False, "exception":'Транспорт не арендовали'}
                return {"status":True, "response":rez_list}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Создание аренды; +
    def admin_create_rent(self, token, u_id, tr_id, rent_type, rent_point_start, rent_start, descr = ""):
            if self.is_tokenvalid(token):
                if self.is_admin(token):
                    try:
                        self.cursor.execute("SELECT create_rent(%s, %s, %s, %s, %s, %s);", (u_id, tr_id, rent_type, rent_point_start, rent_start, descr))
                    except psycopg2.Error as e:
                        self.connect.rollback() 
                        error_mess = e.pgerror.split("\n")[0]
                        return {"status":False, "exception":error_mess}
                    else:
                        self.connect.commit()
                        return {"status":True, "response":'Аренда создана'}
                return {"status":False, "exception":'Вы не являетесь администратором'}
            return {"status":False, "exception":'Необходимо авторизоваться'}


    #Завершение аренды по id, админом +
    def admin_delete_rent(self, token, rent_id, rnt_point_finish):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                try:
                    self.cursor.execute("SELECT admin_delete_rent(%s, %s);", (rent_id, rnt_point_finish))
                except psycopg2.Error as e:
                    self.connect.rollback() 
                    error_mess = e.pgerror.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Аренда завершена'}  
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Удаление записи об аренде по id; +
    def admin_rent_delete(self, token, rent_id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                try:
                    self.cursor.execute(f"SELECT admin_rent_delete({rent_id});")
                except psycopg2.Error as e:
                    self.connect.rollback() 
                    error_mess = e.pgerror.split("\n")[0]
                    return {"status":False, "exception":error_mess}
                else:
                    self.connect.commit()
                    return {"status":True, "response":'Запись об аренде удалена'}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}


    #Получение действующих аренд пользователя аккаунта +
    def get_curr_rent_user(self, token, u_id):
        if self.is_tokenvalid(token):
            if self.is_admin(token):
                self.cursor.execute(f"SELECT rent_id, trnsp_id, renttype, rentprice, description, rent_point_start, rent_point_finish, rent_start FROM rents WHERE user_id = {u_id} AND rent_finish is null;")
                res = self.cursor.fetchone()
                rent_list = []
                while res != None:
                    strez = str(res[7])

                    rent_list.append({
                    "rent_id":res[0],
                    "trnsp_id":res[1],
                    "renttype":res[2],
                    "rentprice":res[3],
                    "description":res[4],
                    "rent_point_start":res[5],
                    "rent_point_finish":res[6],
                    "rent_start":strez,
                    })
                    res = self.cursor.fetchone()
                return {"status":True, "response":rent_list}
            return {"status":False, "exception":'Вы не являетесь администратором'}
        return {"status":False, "exception":'Необходимо авторизоваться'}