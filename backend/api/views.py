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
    Series
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
    SeriesSerializer
)
import requests
import random
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from datetime import timedelta
from django.db.models import Count, F, Min, OuterRef, Prefetch, Q, Subquery, Max
from django.http import StreamingHttpResponse
from django.shortcuts import get_object_or_404
from googletrans import Translator
from django.db.models.functions import Coalesce

import boto3
class UsersViewSet(viewsets.ModelViewSet): 
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    def get_queryset(self):
        # Получаем tg_id из запроса, установленного через middleware
        tg_id = self.request.tg_user_data['tg_id']
        #return tg_id

        if tg_id:
            # Фильтруем балансы по пользователю, соответствующему tg_id
            return Users.objects.filter(tg_id=tg_id)
        else:
            return Users.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        #return Response({f'G {queryset}'})

        if queryset.exists():
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


    def create(self, request, *args, **kwargs):
        # POST - Создание нового баланса
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

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

    # Эндпоинт для добавления элемента в историю поиска
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

    def get_user_language(self):
        # Получаем текущего пользователя по его tg_id
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        user = Users.objects.filter(tg_id=tg_id).first()
        if user and user.lang:
            return user.lang.lang_name  # Возвращаем имя языка пользователя (например, 'ru', 'en', и т.д.)
        return 'en'  # Если язык не указан, используем английский по умолчанию

    def translate_it(self, text, target_lang):
        if not text:
            return '' 

        translator = Translator()
        translated = translator.translate(text, dest=target_lang)
        return translated.text

    @action(detail=False, methods=['get'])
    def get_serail_details(self, request, url_path='serail-details'):
        # Получаем язык пользователя
        user_lang = self.get_user_language()
        data = request.query_params.get('data', None)
        
        if data is not None:
            try:
                serails = Serail.objects.prefetch_related(
                    'comments', 
                    'genre', 
                    'statusnew'
                ).filter(id=int(data))  # Фильтрация по id
            except ValueError:
                serails = Serail.objects.prefetch_related(
                    'comments', 
                    'genre', 
                    'statusnew'
                ).filter(name__icontains=data)  # Фильтрация по имени (не чувствительно к регистру)
        else:
            serails = Serail.objects.prefetch_related(
                'comments', 
                'genre', 
                'statusnew'
            ).all()

        result_data = []
        for serail in serails:
            name_translated = self.translate_it(serail.name, user_lang)
            description_translated = self.translate_it(serail.description, user_lang)
            comments_translated = [self.translate_it(comment.text, user_lang) for comment in serail.comments.all()]
            genre_translated = str(self.translate_it(str(serail.genre), user_lang)) if serail.genre else None
            serail_data = {
                'name': name_translated,
                'genre': genre_translated,
                'rating': serail.rating,
                'description': description_translated,
                'comments': comments_translated,
                'is_new': serail.statusnew.exists(),  # Проверка наличия статуса "новый"
                'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,  # Вертикальная фотография
                'horizontal_photos': []  # Инициализируем список горизонтальных фотографий
            }

            for i in range(10):  # 10 - количество горизонтальных фотографий
                photo_field = getattr(serail, f'horizontal_photo{i}', None)
                if photo_field:
                    serail_data['horizontal_photos'].append(photo_field.url)  # Добавляем URL фотографии

            result_data.append(serail_data)

        return Response(result_data)

    @action(detail=False, methods=['get'])
    def get_recommends(self, request):
        # 1. 60% сериалов с наивысшим рейтингом
        total_serails = Serail.objects.count()
        top_60_percent = int(total_serails * 0.6)
        top_by_rating = Serail.objects.order_by('-rating')[:top_60_percent]

        # 2. 20% сериалов с наибольшим количеством комментариев
        top_20_percent = int(total_serails * 0.2)
        top_by_comments = Serail.objects.annotate(
            comment_count=Count('comments__id')
        ).order_by('-comment_count')[:top_20_percent]

        # 3. 20% случайных сериалов
        random_20_percent = int(total_serails * 0.2)
        random_serails = Serail.objects.order_by('?')[:random_20_percent]

        # Сериалы со статусом "новый"
        status_new_serails = Serail.objects.filter(statusnew__isnull=False)

        # Собираем все уникальные сериалы в результат
        result_data = list(top_by_rating) + list(top_by_comments) + list(random_serails) + list(status_new_serails)
        result_data = list(set(result_data))  # Удаляем дубликаты

        # Используем кастомный сериализатор
        serializer = SerailSerializer(result_data, many=True)
        return Response(serializer.data)


    @action(detail=False, methods=['get'])
    def get_top_3(self, request):
        # Получаем язык пользователя
        user_lang = self.get_user_language()

        # Получаем сериал с максимальными просмотрами
        top_by_views = Serail.objects.order_by('-views').first()

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
                    name_translated = self.translate_it(serail.name, user_lang) if serail.name else ''
                    description_translated = self.translate_it(serail.description, user_lang) if serail.description else ''

                    serail_data = {
                        'id': serail.id,
                        'name': name_translated,
                        'genre': str(serail.genre) if serail.genre else None,
                        'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                        'rating': serail.rating,
                        'description': description_translated
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
                    name_translated = self.translate_it(serail.name, user_lang) if serail.name else ''
                    description_translated = self.translate_it(serail.description, user_lang) if serail.description else ''

                    serail_data = {
                        'id': serail.id,
                        'name': name_translated,
                        'genre': str(serail.genre) if serail.genre else None,
                        'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                        'rating': serail.rating,
                        'description': description_translated
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
                name_translated = self.translate_it(serail.name, user_lang) if serail.name else None
                description_translated = self.translate_it(serail.description, user_lang) if serail.description else None
                genre_translated = str(self.translate_it(str(serail.genre), user_lang)) if serail.genre else None
                serail_data = {
                    'id': serail.id,
                    'name': name_translated,
                    'genre': genre_translated,
                    'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                    'rating': serail.rating,
                    'description': description_translated
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
            name_translated = self.translate_it(serail.name, user_lang) if serail.name else None
            description_translated = self.translate_it(serail.description, user_lang) if serail.description else None
            genre_translated = str(self.translate_it(str(serail.genre), user_lang)) if serail.genre else None
            serail_data = {
                'id': serail.id,
                'name': name_translated,
                'genre': genre_translated,
                'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                'rating': serail.rating,
                'description': description_translated
            }
            result_data.append(serail_data)

        return Response({'you_might_like': result_data})


    @action(detail=False, methods=['get'])
    def get_category_serials(self, request):
        # Получаем параметр data из запроса
        data = request.query_params.get('data')

        # Определяем количество сериалов для выборки
        count = 18

        # Если data равен popular, возвращаем 18 сериалов с наибольшим количеством просмотров
        if data == 'popular':
            serials = Serail.objects.order_by('-views')[:count]

        # Если data равен new, возвращаем 18 сериалов, которые имеют статус "новый"
        elif data == 'new':
            serials = Serail.objects.filter(statusnew__isnull=False).order_by('-statusnew__added_date')[:count]

        # Если data равен original, возвращаем 18 оригинальных сериалов
        elif data == 'original':
            serials = Serail.objects.filter(is_original=True)[:count]

        else:
            # Если параметр data отсутствует или не распознан, возвращаем пустой результат
            return Response({'error': 'Invalid or missing data parameter'}, status=400)

        # Формируем результат для сериалов
        result_data = []
        for serail in serials:
            serail_data = {
                'id': serail.id,
                'name': serail.name,
                'genre': str(serail.genre) if serail.genre else None,
                'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,
                'rating': serail.rating,
                'description': serail.description,
                'views': serail.views
            }
            result_data.append(serail_data)

        # Возвращаем сериализированные данные
        return Response({'serials': result_data})
    
    @action(detail=False, methods=['get'], url_path='search')
    def search_serails(self, request):
        search_query = request.query_params.get('query', None)

        if not search_query:
            return Response({'error': 'Не указан параметр query'}, status=status.HTTP_400_BAD_REQUEST)

        # Поиск сериалов по названию или описанию
        serails = Serail.objects.filter(name__icontains=search_query) | Serail.objects.filter(description__icontains=search_query)
        serializer = self.get_serializer(serails, many=True)

        # Сохранение истории поиска
        tg_id = request.tg_user_data.get('tg_id', None)
        if tg_id:
            user = get_object_or_404(Users, tg_id=tg_id)
            search_history = user.search_history or []
            search_history.insert(0, search_query)

            # Удаляем последний элемент, если больше 10
            if len(search_history) > 10:
                search_history = search_history[:10]

            user.search_history = search_history
            user.save()

        return Response({'results': serializer.data}, status=status.HTTP_200_OK)

class StatusNewViewSet(viewsets.ModelViewSet):
    queryset = StatusNew.objects.all()
    serializer_class = StatusNewSerializer


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer


class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all()
    serializer_class = HistorySerializer

class SeriesViewSet(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer

    def stream_video(self, request, pk=None):
        # Получаем серию по первичному ключу (pk)
        series = self.get_object()

        # Создаем клиент S3
        s3_client = boto3.client('s3')

        # Получаем информацию об объекте
        bucket_name = series.video.storage.bucket_name
        video_key = series.video.name

        # Получаем объект из S3
        s3_object = s3_client.get_object(Bucket=bucket_name, Key=video_key)
        
        # Создаем StreamingHttpResponse для потоковой передачи
        response = StreamingHttpResponse(
            s3_object['Body'].iter_chunks(chunk_size=8192),  # Размер чанка можно изменить по вашему усмотрению
            content_type='video/mp4'
        )
        response['Content-Disposition'] = f'inline; filename="{series.name}.mp4"'
        response['Accept-Ranges'] = 'bytes'

        return response

    def get_queryset(self):
        tg_id = getattr(self.request, 'tg_id', None)
        if tg_id:
            return Users.objects.filter(tg_id=tg_id)
        else:
            return Users.objects.none()

    @action(detail=False, methods=['get'])
    def get_shorts(self, request):
        user = self.get_queryset().first()
        if not user:
            return Response({'error': 'User not found'}, status=404)

        viewed_series_ids = ViewedSeries.objects.filter(user=user).values_list('series_id', flat=True)

        random_series = Series.objects.exclude(id__in=viewed_series_ids).order_by('?')[:10]

        if not random_series.exists():
            return Response({'message': 'No more unseen series available'}, status=404)

        for series in random_series:
            ViewedSeries.objects.create(user=user, series=series)

        serializer = SeriesSerializer(random_series, many=True)
        return Response(serializer.data, status=200)

    @action(detail=False, methods=['get'])
    def get_series_by_serail(self, request):
        data = request.query_params.get('data', None)

        if data is not None:
            try:
                serail = Serail.objects.get(id=int(data))
            except ValueError:
               
                serail = Serail.objects.filter(name__icontains=data).first()
        else:
            return Response({'error': 'Parameter "data" is required'}, status=400)

        if not serail:
            return Response({'error': 'No serail found'}, status=404)

        series_list = Series.objects.filter(serail=serail)

        serializer = SeriesSerializer(series_list, many=True)
        return Response(serializer.data)

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


    @action(detail=False, methods=['get'])
    def get_all_series_from_serail(self, request):
        data = request.query_params.get('data', None)

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

        all_series_from_serail = Series.objects.filter(serail=serail)

        serializer = SeriesSerializer(all_series_from_serail, many=True)
        return Response(serializer.data)