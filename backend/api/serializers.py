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
    Subscriptions,
    SerailPrice,
)




class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = '__all__'


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class UsersSerializer(serializers.ModelSerializer):
    lang = LanguageSerializer(read_only=True) 
    country = CountrySerializer(read_only=True)
    photo = serializers.SerializerMethodField()
    class Meta:
        model = Users
        fields = ['tg_id', 'tg_username', 'name', 'photo', 'lang', 'country', 'isActive', 'paid', 'search_history']
        
    def get_photo_url(self, obj):
        # Проверка, есть ли фото
        if obj.photo:
            # Получаем URL текущего фото
            current_url = obj.photo.url

            # Заменяем часть URL на необходимую
            new_url = current_url.replace('/media/', '/media/photos/')
            return new_url
        return None


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

class SubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriptions
        fields = '__all__'
    
class SubscriptionPriceSerializer(serializers.Serializer):
    tg_id = serializers.IntegerField(required=True, help_text="Telegram ID пользователя")

    def validate_tg_id(self, value):
        if not Users.objects.filter(tg_id=value).exists():
            raise serializers.ValidationError("Пользователь с данным tg_id не найден.")
        return value

class SerailPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SerailPrice
        fields = '__all__'