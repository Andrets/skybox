from .models import (
    Users, 
    Language, 
    Country, 
    Admins,
    Genre,
    Serail,
    StatusNew,
    Comments,
    History,
)
from .serializers import (
    UsersSerializer,
    LanguageSerializer,
    CountrySerializer,
    GenreSerializer,
    AdminsSerializer,
    SerailSerializer,
    StatusNewSerializer,
    CommentsSerializer,
    HistorySerializer,
)
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


class AdminsViewSet(viewsets.ModelViewSet):
    queryset = Admins.objects.all()
    serializer_class = AdminsSerializer


class SerailViewSet(viewsets.ModelViewSet):
    queryset = Serail.objects.all()
    serializer_class = SerailSerializer


class StatusNewViewSet(viewsets.ModelViewSet):
    queryset = StatusNew.objects.all()
    serializer_class = StatusNewSerializer


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer


class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer
