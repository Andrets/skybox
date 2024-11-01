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
    ViewedSeries,
    PermissionsModel,
    Payments,
    Subscriptions,
    Feasts,
    Newprice,
    SerailPrice,
    UserRating,
    Tokens,
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
    SeriesSerializer,
    DocsTextsSerializer,
    PaymentsSerializer,
    RatingUpdateSerializer,
    FavoriteSerializer,
    SubscriptionsSerializer,
    SubscriptionPriceSerializer,
    SerailPriceSerializer,
)

import requests
import random
from rest_framework import status, viewsets, permissions, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from datetime import timedelta
from django.db.models import Count, F, Min, OuterRef, Prefetch, Q, Subquery, Max
from django.http import StreamingHttpResponse
from django.shortcuts import get_object_or_404
from django.db.models.functions import Coalesce
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status as rest_status
import boto3
from yookassa import Configuration, Payment
import uuid
from datetime import date 
from urllib.parse import unquote
from aiogram import Bot
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode
from asgiref.sync import sync_to_async, async_to_sync
from aiogram.types import LabeledPrice, PreCheckoutQuery, SuccessfulPayment, ContentType
import telebot
from requests.exceptions import JSONDecodeError

def levenshtein_distance(s1, s2):
    """Calculate the Levenshtein distance between two strings."""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)

    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

class UsersViewSet(viewsets.ModelViewSet): 
    queryset = Users.objects.all()
    serializer_class = UsersSerializer


    http_method_names = ['get', 'post']

    def get_queryset(self):
        tg_id = int(self.request.tg_user_data['tg_id'])

        if tg_id:
            return Users.objects.filter(tg_id=tg_id)
        else:
            return Users.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        if queryset.exists():
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(auto_schema=None)
    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @swagger_auto_schema(auto_schema=None)  
    def retrieve(self, request, *args, **kwargs):
        return Response({"detail": "Method Not Allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def update(self, request, *args, **kwargs):
        # PUT - Обновление существующего баланса
        queryset = self.get_queryset()
        if queryset.exists():
            user = queryset.first()
            serializer = self.get_serializer(user, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response({'error': 'User not found'}, status=404)

    def partial_update(self, request, *args, **kwargs):
        # PATCH - Частичное обновление баланса
        queryset = self.get_queryset()
        if queryset.exists():
            user = queryset.first()
            serializer = self.get_serializer(user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response({'error': 'User not found'}, status=404)

    def destroy(self, request, *args, **kwargs):
        # DELETE - Удаление баланса
        queryset = self.get_queryset()
        if queryset.exists():
            user = queryset.first()
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'User not found'}, status=404)
    
    @action(detail=False, methods=['get'], url_path='search-history')
    def get_search_history(self, request):
        # Получаем tg_id из middleware
        tg_id = self.request.tg_user_data.get('tg_id', None)

        # Проверяем наличие tg_id
        if tg_id:
            # Ищем пользователя по tg_id
            user = get_object_or_404(Users, tg_id=tg_id)

            # Если пользователь найден, возвращаем историю поиска
            return Response({'search_history': user.search_history}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], url_path='add-search-history')
    def add_search_history(self, request):
        # Получаем tg_id из middleware
        tg_id = self.request.tg_user_data.get('tg_id', None)

        # Проверяем наличие tg_id
        if tg_id:
            # Ищем пользователя по tg_id
            user = get_object_or_404(Users, tg_id=tg_id)

            # Получаем новое значение для добавления в историю поиска
            new_search_item = request.data.get('search_item')
            if not new_search_item:
                return Response({'error': 'Отсутствует параметр search_item'}, status=status.HTTP_400_BAD_REQUEST)

            # Добавляем новое значение в начало истории поиска
            search_history = user.search_history or []
            search_history.insert(0, new_search_item)

            # Если количество элементов больше 10, удаляем последний
            if len(search_history) > 10:
                search_history = search_history[:10]

            # Обновляем поле search_history и сохраняем пользователя
            user.search_history = search_history
            user.save()

            return Response({'message': 'Элемент добавлен в историю поиска', 'search_history': user.search_history}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=False, methods=['post'])
    def change_lang(self, request):
        user = self.get_queryset().first()  
        lang_name = request.data.get('lang_name')

        if not lang_name:
            return Response({"error": "Language name is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            new_lang = Language.objects.get(lang_name=lang_name)
        except Language.DoesNotExist:
            return Response({"error": "Language not found."}, status=status.HTTP_404_NOT_FOUND)

        user.lang = new_lang
        user.save()

        return Response({"message": f"Language changed to {new_lang.lang_name}"}, status=status.HTTP_200_OK)


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    http_method_names = ['get']


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    http_method_names = ['get']


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    http_method_names = ['get']

    @swagger_auto_schema(auto_schema=None)  
    def retrieve(self, request, *args, **kwargs):
        return Response({"detail": "Method Not Allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class AdminsViewSet(viewsets.ModelViewSet):
    queryset = Admins.objects.all()
    serializer_class = AdminsSerializer


class SerailViewSet(viewsets.ModelViewSet):
    queryset = Serail.objects.all()
    serializer_class = SerailSerializer

    http_method_names = ['get', 'post']

    @swagger_auto_schema(auto_schema=None)
    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def get_user_language(self):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        if user and user.lang:
            return str(user.lang.lang_name)
        return 'en'




    def translate_it(self, text, target_lang):
        body = {
            "targetLanguageCode": target_lang,
            "texts": text,
            "folderId": 'b1guislt64fc1r7f3jab',
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Api-Key AQVNxoGgtern_AjgdVitH5_aWDlG5sVcRK2Gc8gx"
        }

        try:
            response = requests.post(
                'https://translate.api.cloud.yandex.net/translate/v2/translate',
                json=body,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            return data.get('translations', [{'text': t} for t in text])  

        except JSONDecodeError:
            print("Не удалось декодировать JSON от API перевода.")
            return [{'text': t} for t in text]  

        except requests.RequestException as e:
            print(f"Ошибка запроса: {e}")
            return [{'text': t} for t in text]  




    @action(detail=False, methods=['get'])
    def get_serial_details(self, request):
        user_lang = self.get_user_language()
        data = request.query_params.get('data', None)
        
        if data is not None:
            try:
                serails = Serail.objects.prefetch_related(
                    'genre', 
                    'statusnew'
                ).filter(id=int(data))
            except ValueError:
                serails = Serail.objects.prefetch_related(
                    'genre', 
                    'statusnew'
                ).filter(name__icontains=data)
        else:
            serails = Serail.objects.prefetch_related(
                'genre', 
                'statusnew'
            ).all()

        # Get the user by Telegram ID
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = get_object_or_404(Users, tg_id=tg_id)

        result_data = []
        for serail in serails:
            texts = [serail.name, serail.description, str(serail.genre)]
            newtext = self.translate_it(texts, user_lang)
            new_name = newtext[0]['text']
            new_description = newtext[1]['text']
            new_genre = newtext[2]['text']

            user_has_liked = Favorite.objects.filter(user=user, serail=serail).exists()

            user_rating = UserRating.objects.filter(user=user, serail=serail).first()
            user_specific_rating = user_rating.rating if user_rating else None  # Defaults to None if no rating found

            serail_data = {
                'name': new_name,
                'genre': new_genre,
                'rating': round(float(serail.rating)) if serail.rating else None,
                'user_rating': int(user_specific_rating) if user_specific_rating else None,
                'user_has_liked': user_has_liked,
                'description': new_description,
                'likes': serail.likes,
                'is_new': serail.statusnew.exists(),
                'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                'horizontal_photos': [getattr(serail, f'horizontal_photo{i}', None).url for i in range(10) if getattr(serail, f'horizontal_photo{i}', None)]
            }

            result_data.append(serail_data)

        return Response(result_data)

    @action(detail=False, methods=['get'])
    def get_serial_comments(self, request):
        user_lang = self.get_user_language()
        
        # Получаем значение `data` из query-параметров
        data = request.query_params.get('data', None)
        
        # Проверяем, был ли передан параметр `data`
        if not data:
            return Response({'error': 'Parameter `data` is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ищем сериал по `id` или по имени
        try:
            serail = Serail.objects.prefetch_related('comments').get(id=int(data))
        except ValueError:
            serail = get_object_or_404(Serail, name__icontains=data)
        
        # Формируем список комментариев с учетом языка пользователя
        comments_data = []
        for comment in serail.comments.all():
            texts = [comment.text]
            newtext = self.translate_it(texts, user_lang)
            comment_text = newtext[0]['text']
            comment_data = {
                'text': comment_text,
                'user_avatar': comment.user.photo.url if comment.user.photo else None,
                'tg_username': comment.user.tg_username
            }
            comments_data.append(comment_data)
        
        return Response(comments_data)

    @action(detail=False, methods=['get'])
    def get_top_3(self, request):
        # Получаем язык пользователя
        user_lang = self.get_user_language()

        # Получаем сериал с максимальными просмотрами
        top_by_views = Serail.objects.order_by('-rating').first()

        # Получаем сериал с максимальными лайками в его сериях
        top_by_likes = Serail.objects.annotate(max_likes=Coalesce(Max('series__likes'), 0)).order_by('-max_likes').first()

        # Получаем сериал с наибольшим количеством комментариев
        top_by_comments = Serail.objects.annotate(comment_count=Count('comments')).order_by('-comment_count').first()

        # Собираем все сериалы в список
        top_series = [top_by_views, top_by_likes, top_by_comments]

        # Множество для отслеживания уникальных идентификаторов сериалов
        unique_series_ids = set()
        result_data = []

        for serail in top_series:
            if serail is not None:  # Проверяем, что сериал существует
                if serail.id not in unique_series_ids:  # Проверяем, уникален ли сериал
                    texts = [serail.name, serail.description, str(serail.genre)]
                    newtext = self.translate_it(texts, user_lang)
                    new_name = newtext[0]['text']
                    new_description = newtext[1]['text']
                    new_genre = newtext[2]['text']
                    serail_data = {
                        'id': serail.id,
                        'name': new_name,
                        'genre': new_genre,
                        'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                        'rating': serail.rating,
                        'description': new_description
                    }
                    result_data.append(serail_data)
                    unique_series_ids.add(serail.id)  # Добавляем идентификатор в множество уникальных сериалов

        # Проверяем, сколько сериалов не хватает до 3
        remaining_count = 3 - len(result_data)

        if remaining_count > 0:
            # Получаем случайные сериалы, если они есть
            available_random_series = Serail.objects.exclude(id__in=unique_series_ids)

            if available_random_series.count() > 0:
                # Количество случайных сериалов должно быть не больше, чем оставшееся количество до 3
                random_series = random.sample(list(available_random_series), min(remaining_count, available_random_series.count()))

                for serail in random_series:
                    texts = [serail.name, serail.description, str(serail.genre)]
                    newtext = self.translate_it(texts, user_lang)
                    new_name = newtext[0]['text']
                    new_description = newtext[1]['text']
                    new_genre = newtext[2]['text']
                    serail_data = {
                        'id': serail.id,
                        'name': new_name,
                        'genre': new_genre,
                        'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                        'rating': serail.rating,
                        'description': new_description
                    }
                    result_data.append(serail_data)
                    unique_series_ids.add(serail.id)  # Добавляем идентификатор в множество уникальных сериалов

        return Response({'top_3': result_data})

    @action(detail=False, methods=['get'])
    def get_you_might_like(self, request):
        user_lang = self.get_user_language()
        total_required = 21  # Всего должно быть 21 сериал
        total_series_count = Serail.objects.count()

        # Если сериалов меньше 21, возвращаем все имеющиеся
        if total_series_count <= total_required:
            all_series = Serail.objects.all()
            result_data = []
            for serail in all_series:
                texts = [serail.name, serail.description, str(serail.genre)]
                newtext = self.translate_it(texts, user_lang)
                new_name = newtext[0]['text']
                new_description = newtext[1]['text']
                new_genre = newtext[2]['text']
                    
                serail_data = {
                    'id': serail.id,
                    'name': new_name,
                    'genre': new_genre,
                    'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                    'rating': serail.rating,
                    'description': new_description
                }
                result_data.append(serail_data)
            return Response({'you_might_like': result_data})

        # Количество сериалов в каждой категории (50%, 20%, 30%)
        top_rated_count = round(total_required * 0.5)  # 50% сериалов с наивысшим рейтингом
        most_commented_count = round(total_required * 0.2)  # 20% сериалов с наибольшим количеством комментариев
        random_count = total_required - top_rated_count - most_commented_count  # Остаток для случайных (30%)

        # Получаем сериалы с наивысшим рейтингом
        top_rated_series = Serail.objects.order_by('-rating')[:top_rated_count]

        # Получаем сериалы с наибольшим количеством комментариев
        most_commented_series = Serail.objects.annotate(comment_count=Count('comments')).order_by('-comment_count')[:most_commented_count]

        # Собираем уникальные id уже выбранных сериалов
        unique_series_ids = set(serail.id for serail in top_rated_series) | set(serail.id for serail in most_commented_series)

        # Вычисляем доступное количество случайных сериалов
        available_random_count = Serail.objects.exclude(id__in=unique_series_ids).count()
        random_count = min(random_count, available_random_count)  # Проверяем, что не запрашиваем больше сериалов, чем доступно

        # Получаем случайные сериалы
        random_series = Serail.objects.exclude(id__in=unique_series_ids).order_by('?')[:random_count]

        # Если сериалов не хватает до 21, добавляем дополнительные случайные сериалы
        remaining_count = total_required - (len(top_rated_series) + len(most_commented_series) + len(random_series))
        if remaining_count > 0:
            additional_random_series = Serail.objects.exclude(id__in=unique_series_ids).order_by('?')[:remaining_count]
            random_series = list(random_series) + list(additional_random_series)

        # Объединяем все результаты в один список
        result_series = list(top_rated_series) + list(most_commented_series) + list(random_series)

        # Формируем итоговые данные с переводом только тех полей, которые нужно перевести
        result_data = []
        for serail in result_series:
            texts = [serail.name, serail.description, str(serail.genre)]
            newtext = self.translate_it(texts, user_lang)
            new_name = newtext[0]['text']
            new_description = newtext[1]['text']
            new_genre = newtext[2]['text']
                    
            serail_data = {
                'id': serail.id,
                'name': new_name,
                'genre': new_genre,
                'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                'rating': serail.rating,
                'description': new_description
            }
            result_data.append(serail_data)

        return Response({'you_might_like': result_data})

    @action(detail=False, methods=['get'])
    def get_category_serials(self, request):
        user_lang = self.get_user_language()
        data = request.query_params.get('data')
        count = 18

        if data == 'popular':
            serials = Serail.objects.order_by('-views')[:count]
        elif data == 'new':
            serials = Serail.objects.filter(statusnew__isnull=False).order_by('-statusnew__added_date')[:count]
        elif data == 'original':
            serials = Serail.objects.filter(is_original=True)[:count]
        elif data == 'men':
            men_genre = get_object_or_404(Genre, genre="Men")
            serials = Serail.objects.filter(genre=men_genre)[:count]
        elif data == 'women':
            women_genre = get_object_or_404(Genre, genre="Women")
            serials = Serail.objects.filter(genre=women_genre)[:count]  
        else:
            return Response({'error': 'Invalid or missing data parameter'}, status=400)

        result_data = []
        for serail in serials:
            texts = [serail.name, serail.description, str(serail.genre)]
            newtext = self.translate_it(texts, user_lang)
            new_name = newtext[0]['text']
            new_description = newtext[1]['text']
            new_genre = newtext[2]['text']
            
            serail_data = {
                'id': serail.id,
                'name': new_name,
                'genre': new_genre,
                'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                'rating': serail.rating,
                'description': new_description,
                'views': serail.views,
                'is_new': serail.statusnew.exists()  # Проверка на наличие связанного объекта в StatusNew
            }
            result_data.append(serail_data)

        return Response({'serials': result_data})


    @action(detail=False, methods=['get'], url_path='search')
    def search_serails(self, request):
        search_query = request.query_params.get('query', None)

        if not search_query:
            return Response({'error': 'Не указан параметр query'}, status=status.HTTP_400_BAD_REQUEST)

        user_lang = self.get_user_language()
        search_query = unquote(search_query)

        texts = [search_query]
        newtext = self.translate_it(texts, 'en')
        search_query_translated = newtext[0]['text']

        serails = Serail.objects.filter(
            Q(name__icontains=search_query_translated) | Q(description__icontains=search_query_translated)
        )

        result_data = []

        if serails.exists():
            for serail in serails:
                text = [serail.name, serail.description, str(serail.genre)]
                translated_texts = self.translate_it(text, user_lang)

                name_translated = translated_texts[0]['text']
                description_translated = translated_texts[1]['text']
                genre_translated = translated_texts[2]['text']
                

                serail_data = {
                    'id': serail.id,
                    'name': name_translated,
                    'genre': genre_translated,
                    'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                    'rating': serail.rating,
                    'description': description_translated,
                    'views': serail.views
                }
                result_data.append(serail_data)

        # Если нет результатов по точному совпадению, применяем алгоритм Левенштейна
        else:
            serails = Serail.objects.all()
            threshold = 0.4  # 70% схожести
            for serail in serails:
                name_distance = levenshtein_distance(serail.name, search_query_translated)
                description_distance = levenshtein_distance(serail.description, search_query_translated)

                name_similarity = name_distance / max(len(serail.name), len(search_query_translated))
                description_similarity = description_distance / max(len(serail.description), len(search_query_translated))

                # Проверка на схожесть
                if name_similarity <= threshold or description_similarity <= threshold:
                    text = [serail.name, serail.description, str(serail.genre)]
                    translated_texts = self.translate_it(text, user_lang)

                    name_translated = translated_texts[0]['text']
                    description_translated = translated_texts[1]['text']
                    genre_translated = translated_texts[2]['text']
                    

                    serail_data = {
                        'id': serail.id,
                        'name': name_translated,
                        'genre': genre_translated,
                        'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                        'rating': serail.rating,
                        'description': description_translated,
                        'views': serail.views
                    }
                    result_data.append(serail_data)

        # Сохраняем историю поиска для пользователя
        tg_id = request.tg_user_data.get('tg_id', None)
        if tg_id:
            user = get_object_or_404(Users, tg_id=tg_id)
            search_history = user.search_history or []
            search_history.insert(0, search_query)

            if len(search_history) > 10:
                search_history = search_history[:10]

            user.search_history = search_history
            user.save()

        return Response({'results': result_data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def update_rating(self, request):
        serializer = RatingUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serail_id = serializer.validated_data['serail_id']
            new_rating = serializer.validated_data['rating']

            serail = get_object_or_404(Serail, id=serail_id)
            
            # Calculate the updated rating
            if serail.rating:
                current_rating = float(serail.rating)
                updated_rating = (current_rating + new_rating) / 2
            else:
                updated_rating = new_rating
            
            serail.rating = str(updated_rating)
            serail.save()

            # Retrieve the user by Telegram ID
            tg_id = int(self.request.tg_user_data.get('tg_id', 0))
            user = get_object_or_404(Users, tg_id=tg_id)

            # Update or create a rating entry in UserRating
            UserRating.objects.update_or_create(
                user=user,
                serail=serail,
                defaults={'rating': new_rating}
            )

            return Response({
                "message": "Рейтинг успешно обновлен",
                "new_rating": round(updated_rating)
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def has_active_subscription(self, user):
        now = timezone.now()
        one_year_ago = now - timedelta(days=365)
        one_month_ago = now - timedelta(days=30)

        active_payment = Payments.objects.filter(
            user=user
        ).filter(
            Q(status=Payments.StatusEnum.ALWAYS) |  
            (Q(status=Payments.StatusEnum.TEMPORARILY_YEAR) & Q(created_date__gte=one_year_ago)) |  
            (Q(status=Payments.StatusEnum.TEMPORARILY_MONTH) & Q(created_date__gte=one_month_ago))  
        ).exists()
        return active_payment


    @action(detail=False, methods=['get'])
    def view_searil(self, request):
        data = request.query_params.get('data', None)  # Здесь ID сериала
        user_lang = self.get_user_language()  # Определяем язык пользователя

        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=404)

        user = Users.objects.filter(tg_id=tg_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=404)

        # Проверка наличия параметра data
        if data is not None:
            try:
                serail = Serail.objects.get(id=int(data))  # Получаем сериал по его ID
            except (ValueError, Serail.DoesNotExist):
                return Response({'error': 'Invalid serial ID or not found'}, status=404)
        else:
            return Response({'error': 'Parameter "data" is required'}, status=400)

        # Получаем все серии этого сериала и сортируем их по эпизоду
        all_series_from_serail = Series.objects.filter(serail=serail).order_by('episode')

        result = []
        has_subscription = self.has_active_subscription(user)

        for series_item in all_series_from_serail:
            has_permission = PermissionsModel.objects.filter(user=user, series=series_item).exists()
            
            # Проверяем доступ к серии
            status = has_subscription or has_permission or series_item.episode <= 10

            # Переводим название серии
            text = [series_item.name]
            translated_texts = self.translate_it(text, user_lang)
            name_translated = translated_texts[0]['text']
            # Формируем данные для каждой серии
            series_data = {
                "id": series_item.id,
                "name": name_translated,
                "episode": series_item.episode,
                "status": status
            }

            # Если доступ есть, добавляем URL видео
            if status:
                series_data["video"] = series_item.video.url if series_item.video else None

            result.append(series_data)

        return Response(result)


    @action(detail=False, methods=['get'])
    def like_it(self, request):
        # Получаем ID серии из запроса
        series_id = request.query_params.get('series_id')
        if not series_id:
            return Response({'error': 'Parameter "series_id" is required'}, status=400)

        # Проверяем, что у пользователя есть Telegram ID
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=404)

        # Получаем пользователя по его Telegram ID
        user = get_object_or_404(Users, tg_id=tg_id)

        # Получаем серию и сериал, к которому она относится
        series = get_object_or_404(Series, id=series_id)
        serail = series.serail  # Сериал, к которому относится серия

        # Проверяем, есть ли сериал в избранном пользователя
        favorite = Favorite.objects.filter(user=user, serail=serail).first()

        if favorite:
            # Если сериал уже в избранном, удаляем его
            favorite.delete()
            # Уменьшаем количество лайков для всех серий данного сериала
            series_count = Series.objects.filter(serail=serail).update(likes=F('likes') - 1)
            return Response({"detail": f'Serial "{serail.name}" removed from favorites.'}, status=status.HTTP_200_OK)
        else:
            # Если нет — добавляем сериал в избранное
            Favorite.objects.create(user=user, serail=serail)
            # Увеличиваем количество лайков для всех серий данного сериала
            series_count = Series.objects.filter(serail=serail).update(likes=F('likes') + 1)
            return Response({"detail": f'Serial "{serail.name}" added to favorites.'}, status=status.HTTP_201_CREATED)


    @action(detail=False, methods=['get'])
    def like_serial(self, request):
        # Получаем ID сериала из запроса
        serail_id = request.query_params.get('serail_id')
        if not serail_id:
            return Response({'error': 'Parameter "serail_id" is required'}, status=400)

        # Проверяем, что у пользователя есть Telegram ID
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=404)

        # Получаем пользователя по его Telegram ID
        user = get_object_or_404(Users, tg_id=tg_id)

        # Получаем сериал по его ID
        serail = get_object_or_404(Serail, id=serail_id)

        # Проверяем, есть ли сериал в избранном пользователя
        favorite = Favorite.objects.filter(user=user, serail=serail).first()

        if favorite:
            # Если сериал уже в избранном, удаляем его
            favorite.delete()
            serail.likes -= 1  # Уменьшаем количество лайков
            serail.save()  # Сохраняем изменения
            return Response({"detail": f'Serial "{serail.name}" removed from favorites.'}, status=status.HTTP_200_OK)
        else:
            # Если нет — добавляем сериал в избранное
            Favorite.objects.create(user=user, serail=serail)
            serail.likes += 1  # Увеличиваем количество лайков
            serail.save()  # Сохраняем изменения
            return Response({"detail": f'Serial "{serail.name}" added to favorites.'}, status=status.HTTP_201_CREATED)


class StatusNewViewSet(viewsets.ModelViewSet):
    queryset = StatusNew.objects.all()
    serializer_class = StatusNewSerializer
    http_method_names = ['get']


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer

    http_method_names = ['post']



    @swagger_auto_schema(auto_schema=None)
    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def get_queryset(self):
        tg_id = self.request.tg_user_data['tg_id']

        if tg_id:
            return Users.objects.filter(tg_id=tg_id)
        else:
            return Users.objects.none()

    @action(detail=False, methods=['post'])
    def create_comment(self, request):
        data = request.data
        serial_id = data.get('serial_id')
        comment_text = data.get('text')
        tg_id = request.tg_user_data['tg_id']

        try:
            serial = Serail.objects.get(id=serial_id)
        except Serail.DoesNotExist:
            return Response({'error': 'Сериал не найден'}, status=status.HTTP_404_NOT_FOUND)

        try:
            user = Users.objects.get(tg_id=tg_id)
        except Users.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)

        comment = Comments.objects.create(serail=serial, text=comment_text, user=user)

        serializer = CommentsSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer

    def translate_it(self, text, target_lang):
        body = {
            "targetLanguageCode": target_lang,
            "texts": text,
            "folderId": 'b1guislt64fc1r7f3jab',
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Api-Key AQVNxoGgtern_AjgdVitH5_aWDlG5sVcRK2Gc8gx"
        }

        try:
            response = requests.post(
                'https://translate.api.cloud.yandex.net/translate/v2/translate',
                json=body,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            return data.get('translations', [{'text': t} for t in text])  

        except JSONDecodeError:
            print("Не удалось декодировать JSON от API перевода.")
            return [{'text': t} for t in text]  

        except requests.RequestException as e:
            print(f"Ошибка запроса: {e}")
            return [{'text': t} for t in text]  

    def get_user_language(self):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        if user and user.lang:
            return str(user.lang.lang_name)
        return 'en'


    @action(detail=False, methods=['post'])
    def add_to_history(self, request):
        # Получаем tg_id пользователя из request
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ищем пользователя по tg_id
        user = Users.objects.filter(tg_id=tg_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Получаем id сериала из параметров запроса
        serail_id = request.data.get('serail_id')
        if not serail_id:
            return Response({"error": "Parameter 'serail_id' is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Ищем сериал по id
        try:
            serail = Serail.objects.get(id=serail_id)
        except Serail.DoesNotExist:
            return Response({"error": "Serail not found"}, status=status.HTTP_404_NOT_FOUND)

        # Проверяем, есть ли уже запись в истории для данного пользователя и сериала
        history_entry, created = History.objects.get_or_create(user=user, serail=serail)

        # Если запись была создана, возвращаем соответствующий ответ
        if created:
            return Response({"message": "Serail added to history successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Serail already in history"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def get_history(self, request):
        # Получаем tg_id пользователя из request
        user_lang = self.get_user_language()
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ищем пользователя по tg_id
        user = Users.objects.filter(tg_id=tg_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Получаем записи истории для данного пользователя
        history_entries = History.objects.filter(user=user).select_related('serail')

        # Формируем ответные данные, проверяя существование серий
        history_data = []
        for entry in history_entries:
            if entry.serail:  # Проверяем, что сериал существует
                text = [entry.serail.name]
                translated_texts = self.translate_it(text, user_lang)
                name_translated = translated_texts[0]['text']
                history_data.append({
                    "id": entry.serail.id,
                    "name": name_translated,
                    "cover": entry.serail.vertical_photo.url if entry.serail.vertical_photo else None,
                })

        return Response(history_data, status=status.HTTP_200_OK)


class SeriesViewSet(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer

    http_method_names = ['get', 'post']


    def get_user_language(self):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        if user and user.lang:
            return str(user.lang.lang_name)
        return 'en'

    def translate_it(self, text, target_lang):
        body = {
            "targetLanguageCode": target_lang,
            "texts": text,
            "folderId": 'b1guislt64fc1r7f3jab',
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Api-Key AQVNxoGgtern_AjgdVitH5_aWDlG5sVcRK2Gc8gx"
        }

        try:
            response = requests.post(
                'https://translate.api.cloud.yandex.net/translate/v2/translate',
                json=body,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            return data.get('translations', [{'text': t} for t in text])  

        except JSONDecodeError:
            print("Не удалось декодировать JSON от API перевода.")
            return [{'text': t} for t in text]  

        except requests.RequestException as e:
            print(f"Ошибка запроса: {e}")
            return [{'text': t} for t in text]  

    def get_queryset(self):
        tg_id = getattr(self.request, 'tg_id', None)
        if tg_id:
            return Users.objects.filter(tg_id=tg_id)
        else:
            return Users.objects.none()

    @action(detail=False, methods=['post'])
    def make_viewed(self, request):
        # Получаем tg_id пользователя из request или возвращаем ошибку, если не найден
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if tg_id:
            user = Users.objects.filter(tg_id=tg_id).first()
        else:
            return Response({"detail": "User not found."}, status=404)

        # Получаем series_id из тела запроса (POST)
        series_id = request.data.get('series_id')
        if not series_id:
            return Response({"detail": "Series ID is required."}, status=400)

        # Проверяем, существует ли серия с таким id
        series = get_object_or_404(Series, id=series_id)

        # Добавляем серию в просмотренные
        ViewedSeries.objects.get_or_create(user=user, series=series)

        return Response({"detail": "Series marked as viewed."}, status=200)

    @action(detail=False, methods=['get'])
    def get_shorts(self, request):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if tg_id:
            user = Users.objects.filter(tg_id=tg_id).first()
        else:
            return Response({"detail": "User not found."}, status=404)

        # Получаем просмотренные серии пользователя
        viewed_series_ids = ViewedSeries.objects.filter(user=user).values_list('series_id', flat=True)

        # Проверка подписки пользователя
        one_month_ago = timezone.now() - timedelta(days=30)
        one_year_ago = timezone.now() - timedelta(days=365)
        active_payment = Payments.objects.filter(
            user=user
        ).filter(
            Q(status=Payments.StatusEnum.ALWAYS) |  
            (Q(status=Payments.StatusEnum.TEMPORARILY_YEAR) & Q(created_date__gte=one_year_ago)) |  
            (Q(status=Payments.StatusEnum.TEMPORARILY_MONTH) & Q(created_date__gte=one_month_ago))  
        ).exists()

        # Если активная подписка есть, выбираем все серии, иначе только эпизоды <= 10
        if active_payment:
            queryset = Series.objects.exclude(id__in=viewed_series_ids)
        else:
            queryset = Series.objects.exclude(id__in=viewed_series_ids).filter(episode__lte=10)

        if not queryset.exists():
            return Response({"detail": "No series available."}, status=404)

        # Подбираем 20% с топа и 80% случайных
        count = queryset.count()
        top_20_percent_count = max(1, int(count * 0.2))
        random_80_percent_count = max(0, 10 - top_20_percent_count)

        top_20_percent = queryset.order_by('-likes')[:top_20_percent_count]
        remaining_series = queryset.exclude(id__in=top_20_percent.values_list('id', flat=True))
        random_80_percent = remaining_series.order_by('?')[:random_80_percent_count]

        # Комбинируем и перемешиваем серии
        result_series = list(top_20_percent) + list(random_80_percent)
        random.shuffle(result_series)

        # Проверка доступа к сериям
        filtered_series = []
        for series in result_series:
            has_access = active_payment or PermissionsModel.objects.filter(user=user, series=series).exists() or series.episode <= 10

            if has_access:
                filtered_series.append(series)

        # Сериализация данных с добавлением serail_id и is_liked, а также переводом нужных полей
        user_lang = self.get_user_language()
        serialized_data = []
        for series in filtered_series:
            # Переводим только `serail.name` и `series.name`
            texts = [series.serail.name, series.name]
            newtext = self.translate_it(texts, user_lang)

            new_serail_name = newtext[0]['text']
            new_series_name = newtext[1]['text']

            # Формируем сериализованные данные
            series_data = {
                **self.get_serializer(series).data,
                "serail_id": series.serail.id,  # Добавляем ID сериала
                "is_liked": Favorite.objects.filter(user=user, serail=series.serail).exists(),  # Проверка, добавлен ли сериал в избранное
                "serail_name": new_serail_name,
                "name": new_series_name
            }
            serialized_data.append(series_data)

        return Response(serialized_data)

    @action(detail=False, methods=['get'])
    def get_series(self, request):
        data = request.query_params.get('data', None)

        if data is not None:
            try:
                
                series = Series.objects.filter(id=int(data))
            except ValueError:
                
                series = Series.objects.filter(
                    Q(episode__iexact=data) |  
                    Q(name__icontains=data)  
                )
        else:
            series = Series.objects.all()

        serializer = SeriesSerializer(series, many=True)
        return Response(serializer.data)


    def has_active_subscription(self, user):
        now = timezone.now()
        one_year_ago = now - timedelta(days=365)
        one_month_ago = now - timedelta(days=30)  

        active_payment = Payments.objects.filter(
            user=user
        ).filter(
            Q(status=Payments.StatusEnum.ALWAYS) |  
            (Q(status=Payments.StatusEnum.TEMPORARILY_YEAR) & Q(created_date__gte=one_year_ago)) |  
            (Q(status=Payments.StatusEnum.TEMPORARILY_MONTH) & Q(created_date__gte=one_month_ago))  
        ).exists()
        return active_payment

    @action(detail=False, methods=['get'])
    def get_series_by_serail(self, request):
        data = request.query_params.get('data', None)
        user_lang = self.get_user_language()

        if data is not None:
            try:
                serail = Serail.objects.get(id=int(data))
            except ValueError:
                serail = Serail.objects.filter(name__icontains=data).first()
        else:
            return Response({'error': 'Parameter "data" is required'}, status=400)

        if not serail:
            return Response({'error': 'No serail found'}, status=404)

        series_list = Series.objects.filter(serail=serail).order_by('episode')

        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=404)

        user = Users.objects.filter(tg_id=tg_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=404)

        has_subscription = self.has_active_subscription(user)

        translated_series = []
        for series_item in series_list:
            # Проверяем доступ
            has_permission = PermissionsModel.objects.filter(user=user, series=series_item).exists()
            status = has_subscription or has_permission or series_item.episode <= 10

            texts = [series_item.serail.name, series_item.name] 
            newtext = self.translate_it(texts, user_lang)
        
            serail_name_translated = newtext[0]['text']
            name_translated = newtext[1]['text']

       
            # Формируем ответные данные для каждой серии
            if status:
                series_data = {
                    "id": series_item.id,
                    "serail_name": serail_name_translated,
                    "episode": series_item.episode,
                    "name": name_translated,
                    "likes": series_item.likes,
                    "video": series_item.video.url if series_item.video else None,
                    "status": status  # Статус доступа
                }
            else:
                series_data = {
                    "id": series_item.id,
                    "serail_name": serail_name_translated,
                    "episode": series_item.episode,
                    "name": name_translated,
                    "likes": series_item.likes,
                    "status": status  # Статус доступа
                }
            translated_series.append(series_data)

        return Response(translated_series)

    @action(detail=False, methods=['get'])
    def get_all_series_from_serail(self, request):
        data = request.query_params.get('data', None)

        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=404)

        user = Users.objects.filter(tg_id=tg_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=404)

        if data is not None:
            try:
                series = Series.objects.get(id=int(data))
            except ValueError:
                series = Series.objects.filter(
                    Q(episode__iexact=data) |  
                    Q(name__icontains=data)  
                ).first()  
        else:
            return Response({'error': 'Parameter "data" is required'}, status=400)

        if not series:
            return Response({'error': 'No series found'}, status=404)

        serail = series.serail

        all_series_from_serail = Series.objects.filter(serail=serail).order_by('episode')

        result = []
        has_subscription = self.has_active_subscription(user) 

        for series_item in all_series_from_serail:
            has_permission = PermissionsModel.objects.filter(user=user, series=series_item).exists()

            status = True if has_subscription or has_permission or series_item.episode <= 10 else False

            series_data = {
                "id": series_item.id,
                "name": series_item.name,
                "episode": series_item.episode,
                "status": status  
            }

            if status and series_item.video:
                series_data["video"] = series_item.video.url

            result.append(series_data)

        return Response(result)


class DocsTextsViewSet(viewsets.ModelViewSet):
    queryset = DocsTexts.objects.all()
    serializer_class = DocsTextsSerializer

    http_method_names = ['get']


    @swagger_auto_schema(auto_schema=None)  
    def retrieve(self, request, *args, **kwargs):
        return Response({"detail": "Method Not Allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def get_user_language(self):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        if user and user.lang:
            return str(user.lang.lang_name)
        return 'en'

    def translate_it(self, text, target_lang):
        body = {
            "targetLanguageCode": target_lang,
            "texts": text,
            "folderId": 'b1guislt64fc1r7f3jab',
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Api-Key AQVNxoGgtern_AjgdVitH5_aWDlG5sVcRK2Gc8gx"
        }

        try:
            response = requests.post(
                'https://translate.api.cloud.yandex.net/translate/v2/translate',
                json=body,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            return data.get('translations', [{'text': t} for t in text])  

        except JSONDecodeError:
            print("Не удалось декодировать JSON от API перевода.")
            return [{'text': t} for t in text]  

        except requests.RequestException as e:
            print(f"Ошибка запроса: {e}")
            return [{'text': t} for t in text]  

    @action(detail=False, methods=['get'])
    def get_docs(self, request):
        doc_type = request.query_params.get('type', None)
        if not doc_type:
            return Response({"error": "Document type is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_lang = self.get_user_language()

        document = DocsTexts.objects.filter(name=doc_type, lang__lang_name=user_lang).first()

        if document:
            serializer = self.get_serializer(document)
            return Response(serializer.data)
        else:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)


Configuration.account_id = '465363'
Configuration.secret_key = 'test_UoRVwVuT-qtHat2h6NW4V2Y3lsRmfFBtapATvT7Vf6s'

#bot = Bot('8090358352:AAHqI7UIDxQSgAr0MUKug8Ixc0OeozWGv7I', default=DefaultBotProperties(parse_mode=ParseMode.HTML))
bot = telebot.TeleBot("8090358352:AAHqI7UIDxQSgAr0MUKug8Ixc0OeozWGv7I")



class PaymentsViewSet(viewsets.ModelViewSet):
    queryset = Payments.objects.all()
    serializer_class = PaymentsSerializer



    def get_discounted_price(self, base_price, percent_discount):
        """Расчет цены со скидкой."""
        return round(float(base_price) * (1 - float(percent_discount) / 100), 2)

    def get_feast_discount(self):
        """Получение скидки на сегодня из праздников."""
        today = date.today()
        feast = Feasts.objects.filter(date=today).first()
        if feast:
            return {
                "percent": float(feast.percent),
                "stars_percent": float(feast.stars_percent)
            }
        return {"percent": 0, "stars_percent": 0}


    def get_personal_price(self, tg_id):
        """Проверка и получение персональной цены для пользователя."""
        newprice_entries = Newprice.objects.filter(updtype=Newprice.StatusEnum.PERSONAL)

        for entry in newprice_entries:
            if tg_id in entry.data:
                return entry
            
        return None

    def get_group_price(self, tg_id):
        """Проверка и получение групповой цены для пользователя."""
        newprice_entries = Newprice.objects.filter(updtype=Newprice.StatusEnum.GROUP)

        for entry in newprice_entries:
            if tg_id in entry.data:
                return entry
            
        return None


    @action(detail=False, methods=['post'])
    def create_payment(self, request):
        # Получение payment_id и типа подписки из параметров запроса
        payment_id = request.query_params.get('payment_id', None)
        subscription_type = request.query_params.get('subscription_type', None)
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        # Проверка наличия payment_id
        if not payment_id:
            return Response({'error': 'Payment ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Получение подписки по типу
        subscriptionel = get_object_or_404(Subscriptions, subtype=subscription_type)

        # Формирование idempotence_key
        # Получаем базовые цены подписок
        subscriptions = Subscriptions.objects.all()  # Получаем все записи подписок

        results = []
        feast_discount = self.get_feast_discount()  # Получение скидки на праздники

        # Получаем персональную и групповую цены, если существуют
        personal_price = self.get_personal_price(tg_id)

        group_price = self.get_group_price(tg_id)

        for subscription in subscriptions:
            base_price = float(subscription.price)
            stars_base_price = float(subscription.stars_price)

            # Если есть персональная цена, используем её
            if personal_price:

                
                if subscription.subtype == personal_price.periodtype:

                    base_price = float(personal_price.price)
                    stars_base_price = float(personal_price.stars_price)

            # Если нет персональной цены, проверяем групповую
            elif group_price:
                if subscription.subtype in group_price.data:  # Проверка принадлежности к группе
                    base_price = float(group_price.price)
                    stars_base_price = float(group_price.stars_price)

            # Применяем скидки
            price_with_discount = self.get_discounted_price(base_price, int(subscription.percent))
            stars_price_with_discount = self.get_discounted_price(stars_base_price, int(subscription.stars_percent))

            # Добавляем праздничные скидки
            price_with_discount = self.get_discounted_price(price_with_discount, feast_discount['percent'])
            stars_price_with_discount = self.get_discounted_price(stars_price_with_discount, feast_discount['stars_percent'])

            results.append({
                "subtype": subscription.subtype,
                "price_in_rubles": round(price_with_discount, 2),
                "price_in_stars": round(stars_price_with_discount, 2),
            })
        try:
            # Получение цены подписки из модели
            price_value = 0
            for el in results:
                if el['subtype'] == f'{subscriptionel.subtype}':
                    price_value = el['price_in_rubles']
                    break
            idempotence_key = str(uuid.uuid4())
            payment = Payment.create({
                "payment_token": payment_id,
                "amount": {
                    "value": price_value,
                    "currency": "RUB"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": "https://skybox.video/"
                },
                "capture": True,
                "description": f"Заказ для подписки {subscriptionel.subtype}"
            }, idempotence_key)
            confirmation_url = payment.confirmation.confirmation_url if payment.confirmation else None

            new_payment = Payments.objects.create(
                user=user,
                summa=int(price_value),
                status=subscription_type  
            )
            if not user.isActive:
                user.isActive = True
                user.paid = True
                user.save()
            return Response({'status': payment.status, 'payment_id': new_payment.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['post'])
    def create_payment_serail(self, request):
        # Получение payment_id и типа подписки из параметров запроса
        payment_id = request.query_params.get('payment_id', None)
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        
        # Проверка наличия payment_id и пользователя
        if not payment_id:
            return Response({'error': 'Payment ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Получение ID сериала
        serail_id = request.query_params.get('serail_id')
        if not serail_id:
            return Response({"detail": "serail_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Получение цены сериала
        serail_price = SerailPrice.objects.filter(serail_id=serail_id).first()
        if not serail_price:
            return Response({"detail": "Price for the specified serial not found."}, status=status.HTTP_404_NOT_FOUND)

        base_price = int(serail_price.price)
        stars_base_price = int(serail_price.stars_price)

        # Применение праздничной скидки
        feast_discount = self.get_feast_discount()
        price_with_discount = self.get_discounted_price(base_price, feast_discount['percent'])

        # Формирование idempotence_key
        idempotence_key = str(uuid.uuid4())

        try:
            # Создание платежа
            payment = Payment.create({
                "payment_token": payment_id,
                "amount": {
                    "value": price_with_discount,
                    "currency": "RUB"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": "https://skybox.video/"
                },
                "capture": True,
                "description": f"Заказ для сериала {serail_id}"
            }, idempotence_key)
            confirmation_url = payment.confirmation.confirmation_url if payment.confirmation else None

            # Создание записи о платеже
            new_payment = Payments.objects.create(
                user=user,
                summa=int(price_with_discount),
                status=Payments.StatusEnum.ONCE
            )

            # Получаем все серии для указанного сериала и создаем доступ для каждой
            series_list = Series.objects.filter(serail_id=serail_id)
            for series in series_list:
                PermissionsModel.objects.create(series=series, user=user)
            if not user.isActive:
                user.isActive = True
                user.paid = True
                user.save()
            return Response({'status': payment.status, 'payment_id': new_payment.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def create_invoice(self, price_value, payload):
        prices = [telebot.types.LabeledPrice(label="Image Purchase", amount=int(price_value))]  # сумма в минимальных единицах валюты, например, 100 = 1.00 XTR

        # Создаем ссылку на оплату
        payment_link = bot.create_invoice_link(
            title="Image Purchase",
            description="Purchase an image for 1 star!",
            payload=payload,
            provider_token="",
            currency="XTR",
            prices=prices
        )
        return payment_link

    def create_token(self, user):
        payload_token = random.randint(10**15, 10**16 - 1)
        token = Tokens.objects.create(user=user, payloadtoken=payload_token, is_paid=False)
        return token.payloadtoken

    @action(detail=False, methods=['post'])
    def create_payment_stars(self, request):
        subscription_type = request.query_params.get('subscription_type', None)
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        
        subscriptionel = get_object_or_404(Subscriptions, subtype=subscription_type)
        subscriptions = Subscriptions.objects.all()
        results = []

        # Получаем скидки и цены
        feast_discount = self.get_feast_discount()
        personal_price = self.get_personal_price(tg_id)
        group_price = self.get_group_price(tg_id)
        
        for subscription in subscriptions:
            base_price = float(subscription.price)
            stars_base_price = float(subscription.stars_price)
            
            if personal_price and subscription.subtype == personal_price.periodtype:
                base_price = float(personal_price.price)
                stars_base_price = float(personal_price.stars_price)
            elif group_price and subscription.subtype in group_price.data:
                base_price = float(group_price.price)
                stars_base_price = float(group_price.stars_price)
            
            price_with_discount = self.get_discounted_price(base_price, int(subscription.percent))
            stars_price_with_discount = self.get_discounted_price(stars_base_price, int(subscription.stars_percent))
            
            price_with_discount = self.get_discounted_price(price_with_discount, feast_discount['percent'])
            stars_price_with_discount = self.get_discounted_price(stars_price_with_discount, feast_discount['stars_percent'])

            results.append({
                "subtype": subscription.subtype,
                "price_in_rubles": round(price_with_discount, 2),
                "price_in_stars": round(stars_price_with_discount, 2),
            })
        
        try:
            price_value = next((el['price_in_stars'] for el in results if el['subtype'] == subscriptionel.subtype), None)
            if price_value is None:
                return Response({'error': 'Price not found'}, status=status.HTTP_404_NOT_FOUND)

            new_payment = Payments.objects.create(user=user, summa=int(price_value), status=subscription_type)
            payload_token = self.create_token(user)
            payment_link = self.create_invoice(price_value, payload_token)
            
            if not user.isActive:
                user.isActive = True
                user.paid = True
                user.save()
            
            return Response({'payment_link': payment_link, 'payload_token': payload_token, 'ready_to_pay': True}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def create_payment_stars_serail(self, request):
        # Получение payment_id и типа подписки из параметров запроса
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()

        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Получение ID сериала
        serail_id = request.query_params.get('serail_id')
        if not serail_id:
            return Response({"detail": "serail_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Получение цены сериала
        serail_price = SerailPrice.objects.filter(serail_id=serail_id).first()
        if not serail_price:
            return Response({"detail": "Price for the specified serial not found."}, status=status.HTTP_404_NOT_FOUND)

        base_price = int(serail_price.price)
        stars_base_price = int(serail_price.stars_price)

        # Применение праздничной скидки
        feast_discount = self.get_feast_discount()
        price_with_discount = self.get_discounted_price(stars_base_price, feast_discount['percent'])

        if price_with_discount is None:
            return Response({'error': 'Price not found'}, status=status.HTTP_404_NOT_FOUND)

        new_payment = Payments.objects.create(
                user=user,
                summa=int(price_with_discount),
                status=Payments.StatusEnum.ONCE
        )
        payload_token = self.create_token(user)
        payment_link = self.create_invoice(price_with_discount, payload_token)
        series_in_serial = Series.objects.filter(serial_id=serail_id)

        # Выдача доступа к каждой серии
        for series in series_in_serial:
            PermissionsModel.objects.create(user=user, series=series)
        if not user.isActive:
            user.isActive = True
            user.paid = True
            user.save()
            
        return Response({'payment_link': payment_link, 'payload_token': payload_token, 'ready_to_pay': True}, status=status.HTTP_201_CREATED)

    def get_token_status(self, payload_token):
        try:
            token_obj = Tokens.objects.get(payloadtoken=payload_token)
            return {'status': 'success', 'is_paid': token_obj.is_paid}
        except Tokens.DoesNotExist:
            return {'status': 'error', 'message': 'Token not found'}

    @action(detail=False, methods=['get'])
    def check_token_status(self, request):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        payload_token = request.query_params.get('payload_token', None)
        
        if not payload_token:
            return Response({'error': 'payload_token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payload_token = int(payload_token)
        except ValueError:
            return Response({'error': 'Invalid payload_token format'}, status=status.HTTP_400_BAD_REQUEST)

        result = self.get_token_status(payload_token)
        
        if result['status'] == 'success':
            if result['is_paid']:
                if not user.isActive:
                    user.isActive = True
                    user.paid = True
                    user.save()
            return Response({'is_paid': result['is_paid']}, status=status.HTTP_200_OK)
        else:
            return Response({'error': result['message']}, status=status.HTTP_404_NOT_FOUND)


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    http_method_names = ['get', 'post']

    @swagger_auto_schema(auto_schema=None)
    def create(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @swagger_auto_schema(auto_schema=None)
    def list(self, request):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @swagger_auto_schema(auto_schema=None)  
    def retrieve(self, request, *args, **kwargs):
        return Response({"detail": "Method Not Allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def get_user_language(self):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        if user and user.lang:
            return str(user.lang.lang_name)
        return 'en'

    def translate_it(self, text, target_lang):
        body = {
            "targetLanguageCode": target_lang,
            "texts": text,
            "folderId": 'b1guislt64fc1r7f3jab',
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Api-Key AQVNxoGgtern_AjgdVitH5_aWDlG5sVcRK2Gc8gx"
        }

        try:
            response = requests.post(
                'https://translate.api.cloud.yandex.net/translate/v2/translate',
                json=body,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            return data.get('translations', [{'text': t} for t in text])  

        except JSONDecodeError:
            print("Не удалось декодировать JSON от API перевода.")
            return [{'text': t} for t in text]  

        except requests.RequestException as e:
            print(f"Ошибка запроса: {e}")
            return [{'text': t} for t in text]  

    @action(detail=False, methods=['get'])
    def get_my_list(self, request):
        user_lang = self.get_user_language()
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=404)
        
        user = Users.objects.filter(tg_id=tg_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=404)

        favorite_series = Favorite.objects.filter(user=user).select_related('serail')

        if not favorite_series.exists():
            return Response([], status=200)
        serialized_data = []
        for favorite in favorite_series:
            translated_text = self.translate_it([favorite.serail.name], user_lang)
            data = {
                "id": favorite.serail.id,
                "name": translated_text[0]['text'],
                "cover": favorite.serail.vertical_photo.url if favorite.serail.vertical_photo else None
            }
            serialized_data.append(data)

                
            

        return Response(serialized_data)


class SubscriptionsViewSet(viewsets.ModelViewSet):
    queryset = Subscriptions.objects.all()
    serializer_class = SubscriptionsSerializer
    http_method_names = ['get']

    def get_discounted_price(self, base_price, percent_discount):
        """Расчет цены со скидкой."""
        return round(float(base_price) * (1 - float(percent_discount) / 100), 2)

    def get_feast_discount(self):
        """Получение скидки на сегодня из праздников."""
        today = date.today()  # Теперь date определен
        feast = Feasts.objects.filter(date=today).first()
        if feast:
            return {
                "percent": float(feast.percent),
                "stars_percent": float(feast.stars_percent)
            }
        return {"percent": 0, "stars_percent": 0}


    def get_personal_price(self, tg_id):
        """Проверка и получение персональной цены для пользователя."""
        newprice_entries = Newprice.objects.filter(updtype=Newprice.StatusEnum.PERSONAL)

        for entry in newprice_entries:
            if tg_id in entry.data:
                return entry
            
        return None

    def get_group_price(self, tg_id):
        """Проверка и получение групповой цены для пользователя."""
        newprice_entries = Newprice.objects.filter(updtype=Newprice.StatusEnum.GROUP)

        for entry in newprice_entries:
            if tg_id in entry.data:
                return entry
            
        return None

    @action(detail=False, methods=['get'])
    def get_subscription_price(self, request):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        user = Users.objects.filter(tg_id=tg_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Получаем базовые цены подписок
        subscriptions = Subscriptions.objects.all()  # Получаем все записи подписок

        results = []
        feast_discount = self.get_feast_discount()  # Получение скидки на праздники

        # Получаем персональную и групповую цены, если существуют
        personal_price = self.get_personal_price(tg_id)

        group_price = self.get_group_price(tg_id)

        for subscription in subscriptions:
            base_price = float(subscription.price)
            stars_base_price = float(subscription.stars_price)

            # Если есть персональная цена, используем её
            if personal_price:

                
                if subscription.subtype == personal_price.periodtype:

                    base_price = float(personal_price.price)
                    stars_base_price = float(personal_price.stars_price)

            # Если нет персональной цены, проверяем групповую
            elif group_price:
                if subscription.subtype in group_price.data:  # Проверка принадлежности к группе
                    base_price = float(group_price.price)
                    stars_base_price = float(group_price.stars_price)

            # Применяем скидки
            price_with_discount = self.get_discounted_price(base_price, int(subscription.percent))
            stars_price_with_discount = self.get_discounted_price(stars_base_price, int(subscription.stars_percent))

            # Добавляем праздничные скидки
            price_with_discount = self.get_discounted_price(price_with_discount, feast_discount['percent'])
            stars_price_with_discount = self.get_discounted_price(stars_price_with_discount, feast_discount['stars_percent'])

            results.append({
                "subtype": subscription.subtype,
                "price_in_rubles": round(price_with_discount, 2),
                "price_in_stars": round(stars_price_with_discount, 2),
            })

        return Response(results, status=status.HTTP_200_OK)


class SerailPriceViewSet(viewsets.ModelViewSet):
    queryset = SerailPrice.objects.all()
    serializer_class = SerailPriceSerializer
    http_method_names = ['get']

    def get_user_language(self):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        if user and user.lang:
            return str(user.lang.lang_name)
        return 'en'

    def translate_it(self, text, target_lang):
        body = {
            "targetLanguageCode": target_lang,
            "texts": text,
            "folderId": 'b1guislt64fc1r7f3jab',
        }
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Api-Key AQVNxoGgtern_AjgdVitH5_aWDlG5sVcRK2Gc8gx"
        }

        try:
            response = requests.post(
                'https://translate.api.cloud.yandex.net/translate/v2/translate',
                json=body,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            return data.get('translations', [{'text': t} for t in text])  

        except JSONDecodeError:
            print("Не удалось декодировать JSON от API перевода.")
            return [{'text': t} for t in text]  

        except requests.RequestException as e:
            print(f"Ошибка запроса: {e}")
            return [{'text': t} for t in text]  

    def get_discounted_price(self, base_price, percent_discount):
        """Расчет цены со скидкой."""
        return round(float(base_price) * (1 - float(percent_discount) / 100), 2)

    def get_feast_discount(self):
        """Получение скидки на сегодня из праздников."""
        today = date.today()
        feast = Feasts.objects.filter(date=today).first()
        if feast:
            return {
                "percent": float(feast.percent),
                "stars_percent": float(feast.stars_percent)
            }
        return {"percent": 0, "stars_percent": 0}

    @action(detail=False, methods=['get'])
    def get_price_by_serail_id(self, request):
        user_lang = self.get_user_language()

        serail_id = request.query_params.get('serail_id')
        if not serail_id:
            return Response({"detail": "serail_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        serailel = Serail.objects.filter(id=serail_id).first()

        serail_price = SerailPrice.objects.filter(serail_id=serail_id).first()
        if not serail_price:
            return Response({"detail": "Price for the specified serial not found."}, status=status.HTTP_404_NOT_FOUND)

        # Получение базовых цен
        base_price = int(serail_price.price)
        stars_base_price = int(serail_price.stars_price)

        # Применение праздничной скидки
        feast_discount = self.get_feast_discount()
        price_with_discount = self.get_discounted_price(base_price, feast_discount['percent'])
        stars_price_with_discount = self.get_discounted_price(stars_base_price, feast_discount['stars_percent'])
        translated_text = self.translate_it([serailel.name], user_lang)


        result = {
            "serail_id": serail_id,
            "serail_name": translated_text[0]['text'],
            "price_in_rubles": price_with_discount,
            "price_in_stars": stars_price_with_discount
        }

        return Response(result, status=status.HTTP_200_OK)

















