from django.conf import settings
from django.http import JsonResponse
from .webapp_auth import WebAppAuth, AuthError  # Импортируем класс WebAppAuth
from urllib.parse import unquote

class TelegramDataMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.auth_handler = WebAppAuth('8090358352:AAHqI7UIDxQSgAr0MUKug8Ixc0OeozWGv7I')  # Создаем экземпляр WebAppAuth

    def __call__(self, request):
        # Получаем initData из заголовков
        init_data = request.headers.get('InitData')
        
        if init_data:
            try:
                # Используем метод get_user_data для получения данных о пользователе
                init_data = str(init_data)
                #output_string = init_data.replace('%3D', '=').replace('%26', '&')
                output_string = unquote(init_data)
                user_data = self.auth_handler.get_user_data(output_string)
                #return JsonResponse({'data': user_data})
                request.tg_user_data = user_data  # Сохраняем данные пользователя в объекте запроса
            except AuthError as e:
                return JsonResponse({'error': e.message}, status=e.status)
        else:
            request.tg_user_data = 'No any init data'

        # Передаем запрос дальше
        response = self.get_response(request)
        return response
 