from rest_framework import serializers
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

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class AdminsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admins
        fields = '__all__'


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class SerailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Serail
        fields = '__all__'


class StatusNewSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusNew
        fields = '__all__'


class CommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = '__all__'
