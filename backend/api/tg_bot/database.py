from asgiref.sync import sync_to_async
from api.models import Users, Admins, Payments, Country, Language, Newprice
from datetime import timedelta, datetime
from django.utils import timezone
from django.db.models import Count
from django.core.exceptions import ObjectDoesNotExist
from googletrans import Translator

import json

# ---------------------
# GET
# ---------------------


@sync_to_async
def translate_it(text, target_lang):
        if not text:
            return '' 

        translator = Translator()
        translated = translator.translate(text, dest=target_lang)
        return translated.text

@sync_to_async
def check_admin(user_id):
    if not Admins.objects.filter(tg_id=user_id).exists():
        return False
    return True

@sync_to_async
def get_users_post():
    queryset = Users.objects.all().values('tg_id')
    return list(queryset)

@sync_to_async
def get_users():
    queryset = Users.objects.all().values('tg_id')
    return len(list(queryset))

@sync_to_async
def get_users_status():
    return Users.objects.filter(isActive=True).count()

@sync_to_async
def get_users_status2():
    return Users.objects.filter(isActive=False).count()


@sync_to_async
def get_total_payments():
    return Payments.objects.count()

@sync_to_async
def get_today_payments():
    today = timezone.now().date()
    return Payments.objects.filter(create_date__date=today).count()

@sync_to_async
def get_week_bookings_count():
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    return Payments.objects.filter(create_date__date__gte=week_start, create_date__date__lte=today).count()

@sync_to_async
def get_month_payments():
    today = timezone.now().date()
    month_start = today.replace(day=1)
    return Payments.objects.filter(create_date__date__gte=month_start, create_date__date__lte=today).count()

@sync_to_async
def get_language(language_code):
    try:
        lang = Language.objects.get(lang_name__iexact=language_code)
        return lang
    except ObjectDoesNotExist:
        return None  

# ---------------------
# POST
# ---------------------

@sync_to_async
def add_user_data(tg_id, tg_username, name, photo, lang_code):
    LANGUAGE_COUNTRY_MAP = {
        "ru": "Россия",
        "en": "США",
        "zh": "Китай",
        "ko": "Южная Корея",
        "tr": "Турция",
        "ar": "Арабские страны"
    }
    country = Country.objects.filter(country_name__iexact=lang_code).first() 
    language = Language.objects.filter(lang_name__iexact=lang_code).first()
    
    if not Users.objects.filter(tg_id=tg_id).exists():
        Users.objects.create(
            tg_id=tg_id,
            tg_username=tg_username,
            name=name,
            photo=photo,
            lang=language,  
            country=country,
        )
        return False
    return True


@sync_to_async
def update_price_personal(types, user_data, price, stars_price):
    # Попробуем найти пользователя по tg_username
    if user_data.startswith('@'):
        user_data = user_data[1:]  # Убираем "@" из имени пользователя

        try:
            user = User.objects.get(tg_username=user_data)  # Ищем пользователя по tg_username
            tg_id = user.tg_id  # Получаем tg_id пользователя
        except User.DoesNotExist:
            return None  # Если пользователь не найден, возвращаем None
    else:
        tg_id = int(user_data)
    new_price = Newprice.objects.create(
        updtype=Newprice.StatusEnum.PERSONAL,
        periodtype=Newprice.StatusEnum2.PERSONAL,
        price=price,
        stars_price=stars_price,
        data=[tg_id]  # Сохраняем tg_id вместо user_data
    )
    return new_price
    
@sync_to_async
def update_price_personal(types, user_data, price, stars_price):
    # Попробуем найти пользователя по tg_username
    if user_data.startswith('@'):
        user_data = user_data[1:]  # Убираем "@" из имени пользователя

        try:
            user = User.objects.get(tg_username=user_data)  # Ищем пользователя по tg_username
            tg_id = user.tg_id  # Получаем tg_id пользователя
        except User.DoesNotExist:
            return None  # Если пользователь не найден, возвращаем None
    else:
        tg_id = int(user_data)
    
    new_price = Newprice.objects.create(
        updtype=Newprice.StatusEnum.GROUP,  # Обновлено для групп
        periodtype=types,
        price=price,
        stars_price=stars_price,
        data=[tg_id]  # Сохраняем tg_id вместо user_data
    )
    return new_price 

# ---------------------
# PUT
# ---------------------

@sync_to_async
def update_user_birthday(tg_id, date):
    try:
        user = User.objects.get(tg_id=tg_id)
        user.birthday = date
        user.save()
        return True
    except User.DoesNotExist:
        return False


# ---------------------
# DELETE
# ---------------------