from asgiref.sync import sync_to_async
from api.models import (Users, Admins, Payments, Country, Language, Newprice, Tokens,  Series, 
Serail, StartBonus, Feasts, Subscriptions, StartBonusSerail, PermissionsModel, SerailPrice)
from datetime import timedelta, datetime, date
from django.utils import timezone
from django.db.models import Count
from django.core.exceptions import ObjectDoesNotExist
from googletrans import Translator
from django.db import IntegrityError
from typing import List, Dict
import json
from requests.exceptions import JSONDecodeError
import requests

from django.db.models import Sum

# ---------------------
# GET
# ---------------------


@sync_to_async
def translate_it(text, target_lang):
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
    return Payments.objects.filter(created_date__date=today).count()

@sync_to_async
def get_week_payments():
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    return Payments.objects.filter(created_date__date__gte=week_start, created_date__date__lte=today).count()

@sync_to_async
def get_month_payments():
    today = timezone.localtime(timezone.now()).date()  # Текущая локальная дата
    month_ago = today - timedelta(days=30)  # Дата 30 дней назад
    return Payments.objects.filter(created_date__date__gte=month_ago, created_date__date__lte=today).count()


@sync_to_async
def get_language(language_code):
    try:
        lang = Language.objects.get(lang_name__iexact=language_code)
        return lang
    except ObjectDoesNotExist:
        return None  

@sync_to_async
def get_users_by_subscription(segment):

    if segment == 'paid':
        return list(Users.objects.filter(paid=True).values_list('tg_id', flat=True))
    elif segment == 'free':
        return list(Users.objects.filter(paid=False).values_list('tg_id', flat=True))
    else:
        return []
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
        user = Users.objects.create(
            tg_id=tg_id,
            tg_username=tg_username,
            name=name,
            photo=photo,
            lang=language,  
            country=country,
        )
        return user
    return False


@sync_to_async
def update_price_personal(types, user_data, price, stars_price):
    # Попробуем найти пользователя по tg_username

    if user_data.startswith('@'):
        user_data = user_data[1:]  # Убираем "@" из имени пользователя

        try:
            print(user_data)
            user = Users.objects.get(tg_username=user_data)  # Ищем пользователя по tg_username
            tg_id = user.tg_id  # Получаем tg_id пользователя
        except User.DoesNotExist:
            return None  # Если пользователь не найден, возвращаем None
    else:
        tg_id = int(user_data)
    if types == "year":
        nt = Newprice.StatusEnum2.TEMPORARILY_YEAR
    elif types == "month":
        nt = Newprice.StatusEnum2.TEMPORARILY_MONTH
    elif types == "week":
        nt = Newprice.StatusEnum2.TEMPORARILY_WEEK
    new_price = Newprice.objects.create(
        updtype=Newprice.StatusEnum.PERSONAL,
        periodtype=nt,
        price=price,
        stars_price=stars_price,
        data=[tg_id]  # Сохраняем tg_id вместо user_data
    )
    return new_price
    
@sync_to_async
def update_price_personal2(types, user_data, price, stars_price):
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
    if types == "year":
        nt = Newprice.StatusEnum2.TEMPORARILY_YEAR
    elif types == "month":
        nt = Newprice.StatusEnum2.TEMPORARILY_MONTH
    elif types == "week":
        nt = Newprice.StatusEnum2.TEMPORARILY_WEEK
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
    if len(date) != 5:
        return False
    if not "." in date:
        return False
    if "-" in date:
        return False
    date_list = date.split(".")
    if int(date_list[0]) > 31 or int(date_list[1]) > 12:
        return False
    try:
        user = Users.objects.get(tg_id=tg_id)
        if user.birthday:
            return 2
        user.birthday = date
        user.save()
        return True
    except Users.DoesNotExist:
        return False

@sync_to_async
def update_payment_status(payload_token):
    try:
        token_obj = Tokens.objects.get(payloadtoken=payload_token)
        token_obj.is_paid = True
        token_obj.save()
        return True
    except Tokens.DoesNotExist:
        return False

@sync_to_async
def update_price_for_all(types, rubs, stars):
    # Определяем соответствие между аргументом types и полем subtype
    subtype_mapping = {
        "year": Subscriptions.StatusEnum.TEMPORARILY_YEAR,
        "month": Subscriptions.StatusEnum.TEMPORARILY_MONTH,
        "week": Subscriptions.StatusEnum.TEMPORARILY_WEEK,
        "always": Subscriptions.StatusEnum.ALWAYS,
        "once": Subscriptions.StatusEnum.ONCE,
    }
    
    # Получаем значение subtype из mapping, соответствующее аргументу types
    subtype_value = subtype_mapping.get(types.lower())
    
    # Проверяем, существует ли соответствующий тип подписки
    if not subtype_value:
        return f"Тип подписки '{types}' не найден."
    
    # Обновляем цены для всех подписок с указанным типом
    Subscriptions.objects.filter(subtype=subtype_value).update(price=str(rubs), stars_price=str(stars))
    return True

@sync_to_async
def update_price_for_serail(serail_name, rubs, stars):
    try:
        # Ищем сериал по имени
        serail = Serail.objects.get(name=serail_name)
        
        # Пытаемся найти или создать запись SerailPrice для этого сериала
        serail_price, created = SerailPrice.objects.update_or_create(
            serail=serail,
            defaults={
                'price': str(rubs),
                'stars_price': str(stars)
            }
        )
        
        # Сообщение об успешном обновлении или создании
        if created:
            return f"Запись для сериала '{serail_name}' создана с ценой {rubs} руб./{stars} stars."
        else:
            return f"Цена для сериала '{serail_name}' обновлена до {rubs} руб./{stars} stars."
    
    except Serail.DoesNotExist:
        return f"Сериал с именем '{serail_name}' не найден."
    except IntegrityError:
        return "Произошла ошибка при обновлении или создании записи."






def get_discounted_price(base_price, percent_discount):
    """Расчет цены со скидкой."""
    return round(float(base_price) * (1 - float(percent_discount) / 100), 2)

def get_feast_discount():
    """Получение скидки на сегодня из праздников."""
    today = date.today()
    feast = Feasts.objects.filter(date=today).first()
    if feast:
        return {
            "percent": float(feast.percent),
            "stars_percent": float(feast.stars_percent)
        }
    return {"percent": 0, "stars_percent": 0}


def get_personal_price(tg_id):
    """Проверка и получение персональной цены для пользователя."""
    newprice_entries = Newprice.objects.filter(updtype=Newprice.StatusEnum.PERSONAL)

    for entry in newprice_entries:
        if tg_id in entry.data:
            return entry           
    return None

def get_group_price(tg_id):
    """Проверка и получение групповой цены для пользователя."""
    newprice_entries = Newprice.objects.filter(updtype=Newprice.StatusEnum.GROUP)

    for entry in newprice_entries:
        if tg_id in entry.data:
            return entry
        
    return None


@sync_to_async
def update_code(tg_id, args):
    try:
        user = Users.objects.filter(tg_id=int(tg_id)).first()
        if not user:
            return "Пользователь не найден."

        start_bonus = None
        serial_bonus = None

        # Попытка найти код в StartBonus
        try:
            start_bonus = StartBonus.objects.get(secret_code__icontains=args)
        except StartBonus.DoesNotExist:
            pass

        # Если не найдено в StartBonus, ищем в StartBonusSerail
        if not start_bonus:
            try:
                serial_bonus = StartBonusSerail.objects.get(secret_code__icontains=args)
            except StartBonusSerail.DoesNotExist:
                return 400  # Код не найден в обеих таблицах
        price_value = 0
        # Логика для обычного бонуса StartBonus
        if start_bonus:
            if int(tg_id) in start_bonus.used_by:
                return 500

            start_bonus.used -= 1
            start_bonus.used_by.append(int(tg_id))
            
            if start_bonus.used <= 0:
                start_bonus.delete()
            else:
                start_bonus.save()

            payment_status = start_bonus.subtype

            # Получаем цену для подписок
            subscriptions = Subscriptions.objects.all()
            feast_discount = get_feast_discount()
            personal_price = get_personal_price(tg_id)
            group_price = get_group_price(tg_id)
            results = []

            for subscription in subscriptions:
                base_price = float(subscription.price)
                stars_base_price = float(subscription.stars_price)

                if personal_price and subscription.subtype == personal_price.periodtype:
                    base_price = float(personal_price.price)
                    stars_base_price = float(personal_price.stars_price)
                elif group_price and subscription.subtype in group_price.data:
                    base_price = float(group_price.price)
                    stars_base_price = float(group_price.stars_price)

                price_with_discount = get_discounted_price(base_price, int(subscription.percent))
                stars_price_with_discount = get_discounted_price(stars_base_price, int(subscription.stars_percent))
                price_with_discount = get_discounted_price(price_with_discount, feast_discount['percent'])
                stars_price_with_discount = get_discounted_price(stars_price_with_discount, feast_discount['stars_percent'])

                results.append({
                    "subtype": subscription.subtype,
                    "price_in_rubles": round(price_with_discount, 2),
                    "price_in_stars": round(stars_price_with_discount, 2),
                })

            # Определение цены для платежа по типу подписки
            price_value = next((el['price_in_rubles'] for el in results if el['subtype'] == payment_status), 0)

        # Логика для бонуса сериалов StartBonusSerail
        elif serial_bonus:
            if int(tg_id) in serial_bonus.used_by:
                return 500

            serial_bonus.used -= 1
            serial_bonus.used_by.append(int(tg_id))

            if serial_bonus.used <= 0:
                serial_bonus.delete()
            else:
                serial_bonus.save()

            # Создание объектов PermissionsModel для всех серий сериала
            for series in Series.objects.filter(serail=serial_bonus.serail):
                PermissionsModel.objects.create(series=series, user=user)

            payment_status = "ONCE"  # Статус для сериалов, указанный как ONCE

            # Получаем цену для сериалов из модели Newprice
            newprice = SerailPrice.objects.filter(
                serail=serial_bonus.serail, 
            ).first()

            if newprice:
                price_value = float(newprice.price)

        # Создание записи в Payments
        Payments.objects.create(
            user_id=user.id,
            summa=price_value,
            status=payment_status
        )

        # Формирование сообщения об успешном бонусе
        status_texts = {
            'TEMPORARILY_YEAR': "на год",
            'TEMPORARILY_MONTH': "на месяц",
            'TEMPORARILY_WEEK': "на неделю",
            'ONCE': "для сериалов"
        }
        return f"Вы получили бонус: подписку {status_texts.get(payment_status, '')}"

    except (StartBonus.DoesNotExist, StartBonusSerail.DoesNotExist):
        return 400  # Неверный секретный код

# ---------------------
# DELETE
# ---------------------