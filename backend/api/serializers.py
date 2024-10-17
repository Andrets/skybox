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
    Series,
    DocsTexts,
    Payments,
    Favorite,
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
    genre = serializers.StringRelatedField()

    class Meta:
        model = Serail
        fields = ['id', 'name', 'vertical_photo', 'genre', 'rating', 'description']
        
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


class SeriesSerializer(serializers.ModelSerializer):
    serail_name = serializers.CharField(source='serail.name', read_only=True)
    class Meta:
        model = Series
        fields = ['id', 'serail_name', 'episode', 'name', 'likes', 'video']

class DocsTextsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocsTexts
        fields = '__all__'

class PaymentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payments
        fields = '__all__'

class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'

class RatingUpdateSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    serail_id = serializers.IntegerField()