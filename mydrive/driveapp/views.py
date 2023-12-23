from django.shortcuts import render
import requests


#Представление для авторизации;
def signin(request):
    return render(request, 'driveapp/signin.html')


#Регистрация пользователя;
def signup(request):
    if request.method == "POST":
        data = request.POST
        if(data['password'] != data['duble_password']):
            return render(request, 'driveapp/signin.html', {'exception':'Пароли не совпадают'})
        if(data['username'] != "" and data['password'] != ""):
            req_data = {"username":data['username'], "password":data['password']}
            response = requests.post('http://127.0.0.1:8000/api/Account/SignUp', req_data) #Запрос на сервер;
            response = response.json() # JWT
            if('response' in response):
                return render(request, 'driveapp/signin.html', {'csrfmiddlewaretoken':data['csrfmiddlewaretoken'], 'response':response['response']})
            return render(request, 'driveapp/signin.html', {'csrfmiddlewaretoken':data['csrfmiddlewaretoken'], 'exception':response['exception']})
        return render(request, 'driveapp/signin.html', {'exception':'Введите имя пользователя и пароль'})
    return render(request, 'driveapp/signin.html', {'exception':'Некорректный запрос'})



#Выход из приложения
def signout(request):
    if request.method == "GET":
        token = request.headers.get('token')
        if(token):
            req_data = {"token":token}
            response = requests.post('http://127.0.0.1:8000/api/Account/SignOut', req_data) #Запрос на сервер;
            response = response.json() # JWT
            if('response' in response):
                return render(request, 'driveapp/signin.html', {'response':response['response']})
            return render(request, 'driveapp/signin.html', {'exception':response['exception']})
    return render(request, 'driveapp/signin.html', {'exception':'Некорректный запрос'})



#Главная страница;
def index(request):
    if request.method == "POST":
        data = request.POST
        if(data['username'] != "" and data['password'] != ""):
            req_data = {"username":data['username'], "password":data['password']}
            response = requests.post('http://127.0.0.1:8000/api/Account/SignIn', req_data) #Запрос на сервер;
            response = response.json() # JWT
            if('token' in response):
                return render(request, 'driveapp/index.html', {'csrfmiddlewaretoken':data['csrfmiddlewaretoken'], 'token':response['token']})
            return render(request, 'driveapp/signin.html', {'csrfmiddlewaretoken':data['csrfmiddlewaretoken'], 'exception':response['exception']})
        return render(request, 'driveapp/signin.html', {'exception':'Введите имя пользователя и пароль'})
    return render(request, 'driveapp/signin.html', {'exception':'Некорректный запрос'})



#Админ страница; 
def admin_page(request):
    if request.method == "GET":
        token = request.headers.get('token')
        ctoken = request.headers.get('X-CSRFToken')
        #print(token)
        #print(ctoken)
        return render(request, 'driveapp/admin_page.html', {'csrfmiddlewaretoken':ctoken, 'token':token})
    return render(request, 'driveapp/signin.html', {'exception':'Некорректный запрос'})



def back_to_index(request):
    if request.method == "GET":
        token = request.headers.get('token')
        ctoken = request.headers.get('X-CSRFToken')
        #print(token)
        #print(ctoken)
        return render(request, 'driveapp/index.html', {'csrfmiddlewaretoken':ctoken, 'token':token})
    return render(request, 'driveapp/signin.html', {'exception':'Некорректный запрос'})