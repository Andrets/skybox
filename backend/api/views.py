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
from googletrans import Translator
from django.db.models.functions import Coalesce
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status as rest_status
import boto3
class UsersViewSet(viewsets.ModelViewSet): 
    queryset = Users.objects.all()
    serializer_class = UsersSerializer


    http_method_names = ['get', 'post']

    def get_queryset(self):
        tg_id = self.request.tg_user_data['tg_id']

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
        if not text:
            return '' 

        translator = Translator()
        translated = translator.translate(text, dest=target_lang)
        return translated.text

    @action(detail=False, methods=['get'])
    def get_serail_details(self, request, url_path='serail-details'):
        user_lang = self.get_user_language()
        data = request.query_params.get('data', None)
        
        if data is not None:
            try:
                serails = Serail.objects.prefetch_related(
                    'comments', 
                    'genre', 
                    'statusnew'
                ).filter(id=int(data))  
            except ValueError:
                serails = Serail.objects.prefetch_related(
                    'comments', 
                    'genre', 
                    'statusnew'
                ).filter(name__icontains=data)  
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
            genre_translated = str(self.translate_it(str(serail.genre), user_lang)) if serail.genre else None

            comments_data = []
            for comment in serail.comments.all():
                comment_data = {
                    'text': self.translate_it(comment.text, user_lang),
                    'user_avatar': comment.user.photo.url if comment.user.photo else None,
                    'tg_username': comment.user.tg_username
                }
                comments_data.append(comment_data)

            serail_data = {
                'name': name_translated,
                'genre': genre_translated,
                'rating': serail.rating,
                'description': description_translated,
                'comments': comments_data,  
                'is_new': serail.statusnew.exists(),  
                'vertical_photo': serail.vertical_photo.url if serail.vertical_photo else None,  
                'horizontal_photos': []  
            }

            for i in range(10):  
                photo_field = getattr(serail, f'horizontal_photo{i}', None)
                if photo_field:
                    serail_data['horizontal_photos'].append(photo_field.url)  

            result_data.append(serail_data)

        return Response(result_data)


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
        data = request.query_params.get('data')

        count = 18

        if data == 'popular':
            serials = Serail.objects.order_by('-views')[:count]

        elif data == 'new':
            serials = Serail.objects.filter(statusnew__isnull=False).order_by('-statusnew__added_date')[:count]

        elif data == 'original':
            serials = Serail.objects.filter(is_original=True)[:count]

        else:
            return Response({'error': 'Invalid or missing data parameter'}, status=400)

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

        return Response({'serials': result_data})
    
    @action(detail=False, methods=['get'], url_path='search')
    def search_serails(self, request):
        search_query = request.query_params.get('query', None)

        if not search_query:
            return Response({'error': 'Не указан параметр query'}, status=status.HTTP_400_BAD_REQUEST)

        serails = Serail.objects.filter(name__icontains=search_query) | Serail.objects.filter(description__icontains=search_query)
        serializer = self.get_serializer(serails, many=True)

        tg_id = request.tg_user_data.get('tg_id', None)
        if tg_id:
            user = get_object_or_404(Users, tg_id=tg_id)
            search_history = user.search_history or []
            search_history.insert(0, search_query)

            if len(search_history) > 10:
                search_history = search_history[:10]

            user.search_history = search_history
            user.save()

        return Response({'results': serializer.data}, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'])
    def update_rating(self, request):
        serializer = RatingUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serail_id = serializer.validated_data['serail_id']
            new_rating = serializer.validated_data['rating']

            serail = get_object_or_404(Serail, id=serail_id)

            current_rating = serail.rating
            updated_rating = (current_rating + new_rating) / 2

            serail.rating = updated_rating
            serail.save()

            return Response({"message": "Рейтинг успешно обновлен", "new_rating": updated_rating}, status=status.HTTP_200_OK)
        else:
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

        # Получаем все серии этого сериала
        all_series_from_serail = Series.objects.filter(serail=serail)

        result = []
        has_subscription = self.has_active_subscription(user)

        for series_item in all_series_from_serail:
            has_permission = PermissionsModel.objects.filter(user=user, series=series_item).exists()
            # Пользователь может просматривать серию, если:
            # - у него активная подписка
            # - есть явное разрешение
            # - эпизод <= 10 (бесплатные серии)
            status = has_subscription or has_permission or series_item.episode <= 10

            # Формируем данные для каждой серии
            series_data = {
                "id": series_item.id,
                "name": series_item.name,
                "episode": series_item.episode,
                "status": status
            }

            # Если доступ есть, добавляем URL видео
            if status:
                series_data["video"] = series_item.video.url if series_item.video else None

            result.append(series_data)

        return Response(result)
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


class SeriesViewSet(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer

    http_method_names = ['get', 'post']


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

        # Если есть активная подписка, выбираем все серии, иначе только серии с эпизодами <= 10
        if active_payment:
            queryset = Series.objects.exclude(id__in=viewed_series_ids)
        else:
            queryset = Series.objects.exclude(id__in=viewed_series_ids).filter(episode__lte=10)

        if not queryset.exists():
            return Response({"detail": "No series available."}, status=404)

        count = queryset.count()
        top_20_percent_count = max(1, int(count * 0.2))
        random_80_percent_count = 10 - top_20_percent_count

        top_20_percent = queryset.order_by('-likes')[:top_20_percent_count]
        remaining_series = queryset.exclude(id__in=top_20_percent.values_list('id', flat=True))
        random_80_percent = remaining_series.order_by('?')[:random_80_percent_count]

        result_series = list(top_20_percent) + list(random_80_percent)
        random.shuffle(result_series)

        # Проверка доступа к сериям
        for series in result_series:
            has_access = False

            # Проверка доступа по PermissionsModel
            if PermissionsModel.objects.filter(user=user, series=series).exists():
                has_access = True

            # Если эпизод <= 10 или пользователь имеет доступ или активную подписку
            if series.episode <= 10 or has_access or active_payment:
                pass
            else:
                result_series.remove(series)  # Удаляем серию, если нет доступа

        serialized_data = self.get_serializer(result_series, many=True).data

        return Response(serialized_data)

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


    def has_active_subscription(self, user):
        now = timezone.now()
        one_year_ago = now - timedelta(days=365)
        one_month_ago = now - timedelta(days=30)  

        active_payment = Payments.objects.filter(
            user=user
        ).filter(
            Q(status=Payments.StatusEnum.ALWAYS) |  # Бессрочная подписка
            (Q(status=Payments.StatusEnum.TEMPORARILY_YEAR) & Q(created_date__gte=one_year_ago)) |  # Подписка на год
            (Q(status=Payments.StatusEnum.TEMPORARILY_MONTH) & Q(created_date__gte=one_month_ago))  # Подписка на месяц
        ).exists()
        return active_payment

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

        all_series_from_serail = Series.objects.filter(serail=serail)

        result = []
        has_subscription = self.has_active_subscription(user) 

        for series_item in all_series_from_serail:
            has_permission = PermissionsModel.objects.filter(user=user, series=series_item).exists()

            status = True if has_subscription or has_permission or series_item.episode <= 10 else False

            if status:
                result.append({
                    "id": series_item.id,
                    "name": series_item.name,
                    "episode": series_item.episode,
                    "video": series_item.video.url if series_item.video else None,
                    "status": status  
                })
            else:
                result.append({
                    "id": series_item.id,
                    "name": series_item.name,
                    "episode": series_item.episode,
                    "status": status  
                })

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
        if not text:
            return '' 

        translator = Translator()
        translated = translator.translate(text, dest=target_lang)
        return translated.text

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


class PaymentsViewSet(viewsets.ModelViewSet):
    queryset = Payments.objects.all()
    serializer_class = PaymentsSerializer


    http_method_names = ['get']

    @action(detail=False, methods=['get'])
    def get_payment(self, request):

        try:
            # Данные для запроса к YooKassa API
            headers = {
                'Authorization': 'Basic qtHat2h6NW4V2Y3lsRmfFBtapATvT7Vf6s',
                'Content-Type': 'application/json',
            }

            # Пример ID платежа
            payment_id = request.query_params.get('payment_id', None)

            if not payment_id:
                return Response({'error': 'Payment ID is required'}, status=400)

            # Запрос к API YooKassa для получения информации о платеже
            response = requests.get(
                f'https://api.yookassa.ru/v3/payments/{payment_id}',
                headers=headers
            )

            # Если запрос успешен, возвращаем данные платежа
            if response.status_code == 200:
                return Response(response.json(), status=200)
            else:
                return Response(response.json(), status=response.status_code)

        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

    @action(detail=False, methods=['get'])
    def get_my_list(self, request):
        tg_id = int(self.request.tg_user_data.get('tg_id', 0))
        if not tg_id:
            return Response({"detail": "User not found."}, status=404)
        
        user = Users.objects.filter(tg_id=tg_id).first()
        if not user:
            return Response({"detail": "User not found."}, status=404)

        favorite_series = Favorite.objects.filter(user=user).select_related('serail')

        if not favorite_series.exists():
            return Response({"detail": "No favorites found."}, status=404)

        serialized_data = [
            {
                "id": favorite.serail.id,
                "name": favorite.serail.name,
                "cover": favorite.serail.vertical_photo.url if favorite.serail.vertical_photo else None
            }
            for favorite in favorite_series
        ]

        return Response(serialized_data)


class SubscriptionsViewSet(viewsets.ModelViewSet):
    queryset = Subscriptions.objects.all()
    serializer_class = SubscriptionsSerializer
    http_method_names = ['get']

































