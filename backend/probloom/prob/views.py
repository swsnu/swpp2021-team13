#from django.shortcuts import render
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse, response 
import json 
from json.decoder import JSONDecodeError
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import User

# Create your views here.
@ensure_csrf_cookie
def userList(request):
    if request.method == 'GET':
        userAllList = [user for user in User.objects.all().values()]
        return JsonResponse(userAllList, safe=False)
    elif request.method == 'POST':
        try:
            body = request.body.decode()
            username = json.loads(body)['username']
            email = json.loads(body)['email']
            password = json.loads(body)['password']
            logged_in = json.loads(body)['logged_in']
        except(KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        user = User(username=username, email=email, password=password, logged_in=logged_in)
        user.save()
        responseDict = {'id': user.id, 'username': user.username}
        return JsonResponse(responseDict, status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

@ensure_csrf_cookie
def userInfo(request, id=0):
    if request.method == 'GET':
        filteredUserInfo = [user for user in User.objects.filter(id=id).values()]
        return JsonResponse(filteredUserInfo, safe=False)
    elif request.method == 'PUT':
        try:
            body = request.body.decode()
            username = json.loads(body)['username']
            email = json.loads(body)['email']
            password = json.loads(body)['password']
            logged_in = json.loads(body)['logged_in']
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        targetUser = User.objects.get(id=id)
        targetUser.username = username
        targetUser.email = email
        targetUser.password = password
        targetUser.logged_in = logged_in
        targetUser.save()
        responseDict = {'id': id, 'username': username, 'email': email, 'password': password, 'logged_in': logged_in}
        return JsonResponse(responseDict, status=201)
    else:
        return HttpResponseNotAllowed(['GET', 'PUT'])
    