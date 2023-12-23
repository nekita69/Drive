from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, viewsets
from .datamanager import Manager
from django.shortcuts import redirect

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

manager = Manager()
