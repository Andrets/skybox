from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, ReplyKeyboardRemove
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import LabeledPrice, PreCheckoutQuery, SuccessfulPayment, ContentType
from aiogram.types.birthdate import Birthdate 
from aiogram.utils.i18n import gettext as _
from aiogram import Bot
from aiogram.methods.get_user_profile_photos import GetUserProfilePhotos
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode

from asgiref.sync import sync_to_async
import django.contrib
from googletrans import Translator
from django.db.models import Sum

from api.models import Users, Series, Serail, PermissionsModel
from api.tg_bot.database import  *
from api.tg_bot.classes_functions import Admin
import api.tg_bot.reply as kb

from pathlib import Path
from datetime import datetime
from os import getenv, environ
from dotenv import load_dotenv

from django.db.models import Q
from datetime import datetime, timedelta
from django.db.models import Count, Min, OuterRef, Prefetch, Q, Subquery, Max

import requests
import aiohttp
import json
import re
import os

user_private = Router()


bot = Bot('8090358352:AAHqI7UIDxQSgAr0MUKug8Ixc0OeozWGv7I', default=DefaultBotProperties(parse_mode=ParseMode.HTML))
@sync_to_async
def gift_most_liked_serial(user):
    serial_by_series_likes = (
        Serail.objects.annotate(total_likes=Sum('series__likes'))
        .order_by('-total_likes')
        .first()
    )
    
    popular_serial = Serail.objects.filter(likes=Serail.objects.aggregate(max_likes=Max('likes')).get('max_likes')).first()

    if serial_by_series_likes and popular_serial:
        most_liked_serial = (
            serial_by_series_likes if serial_by_series_likes.total_likes >= popular_serial.likes else popular_serial
        )
    else:
        most_liked_serial = serial_by_series_likes or popular_serial

    if most_liked_serial:
        series = Series.objects.filter(serail=most_liked_serial)
        for episode in series:
            PermissionsModel.objects.create(series=episode, user=user)
        return True
    return False


@user_private.message(CommandStart())
async def start_message(message: Message, bot: Bot):

    language_code = str(message.from_user.language_code)
    if language_code == "ru":
        await message.answer('🎬 Добро пожаловать в SKYBOX!\n'
                            '\n'
                            'Ваш идеальный помощник для просмотра сериалов.\n'
                            '\n'
                            '📺 Здесь вы можете:\n'
                            '— Искать и находить любимые сериалы\n'
                            '— Узнавать последние новинки\n'
                            '— Сохранять и смотреть короткие видео\n'
                            '\n'
                            'Нажмите «Начать», чтобы открыть приложение и насладиться просмотром сериалов!', 
                            reply_markup=kb.start_inline(language_code))
    elif language_code == "en":
        await message.answer('🎬 Welcome to SKYBOX!\n'
                     '\n'
                     'Your perfect assistant for watching TV shows.\n'
                     '\n'
                     '📺 Here you can:\n'
                     '— Search and find your favorite TV shows\n'
                     '— Discover the latest releases\n'
                     '— Save and watch short videos\n'
                     '\n'
                     'Click "Start" to open the app and enjoy watching TV shows!', 
                     reply_markup=kb.start_inline(language_code))
    elif language_code == "zh":
        await message.answer('🎬 欢迎来到SKYBOX！\n'
                     '\n'
                     '您的最佳电视剧观看助手。\n'
                     '\n'
                     '📺 在这里你可以：\n'
                     '— 搜索并找到你喜欢的电视剧\n'
                     '— 发现最新的剧集\n'
                     '— 保存并观看短视频\n'
                     '\n'
                     '点击“开始”打开应用程序，享受观看电视剧的乐趣！', 
                     reply_markup=kb.start_inline(language_code))
    elif language_code == "ko":
        await message.answer('🎬 SKYBOX에 오신 것을 환영합니다!\n'
                     '\n'
                     '당신의 완벽한 드라마 시청 도우미입니다.\n'
                     '\n'
                     '📺 여기서 할 수 있는 것:\n'
                     '— 좋아하는 드라마를 검색하고 찾기\n'
                     '— 최신 드라마를 알아보기\n'
                     '— 짧은 동영상을 저장하고 보기\n'
                     '\n'
                     '앱을 열고 드라마를 즐기려면 "시작"을 누르세요!', 
                     reply_markup=kb.start_inline(language_code))
    elif language_code == "tr":
        await message.answer('🎬 SKYBOX\'a hoş geldiniz!\n'
                     '\n'
                     'Dizileri izlemek için mükemmel asistanınız.\n'
                     '\n'
                     '📺 Burada şunları yapabilirsiniz:\n'
                     '— Favori dizilerinizi arayın ve bulun\n'
                     '— En son çıkanları keşfedin\n'
                     '— Kısa videoları kaydedin ve izleyin\n'
                     '\n'
                     'Uygulamayı açmak ve dizilerin keyfini çıkarmak için "Başlat"a tıklayın!', 
                     reply_markup=kb.start_inline(language_code))
    elif language_code == "ar":
        await message.answer('🎬 مرحباً بك في SKYBOX!\n'
                     '\n'
                     'مساعدك المثالي لمشاهدة المسلسلات.\n'
                     '\n'
                     '📺 هنا يمكنك:\n'
                     '— البحث والعثور على مسلسلاتك المفضلة\n'
                     '— اكتشاف أحدث الإصدارات\n'
                     '— حفظ ومشاهدة الفيديوهات القصيرة\n'
                     '\n'
                     'اضغط على "ابدأ" لفتح التطبيق والاستمتاع بمشاهدة المسلسلات!', 
                     reply_markup=kb.start_inline(language_code))

    UserProfilePhotos = await bot.get_user_profile_photos(user_id=message.from_user.id)
    file_id = 0
    photo = ''
    
    if UserProfilePhotos.total_count > 0:
        first_photo = UserProfilePhotos.photos[0][0]
        file_id = first_photo.file_id
        
        file = await bot.get_file(file_id=file_id)
        file_path = file.file_path
        file_url = f'https://api.telegram.org/file/bot{bot.token}/{file_path}'
        
        if file_id != 0:
            photo = f'{file_id}.webp'
            save_path = Path('static/media/users') / photo
            save_path.parent.mkdir(parents=True, exist_ok=True)  
            
            async with aiohttp.ClientSession() as session:
                async with session.get(file_url) as response:
                    if response.status == 200:
                        with open(save_path, 'wb') as f:
                            f.write(await response.read())

    user_reg = await add_user_data(
        tg_id=message.from_user.id, 
        tg_username=message.from_user.username, 
        name=message.from_user.first_name, 
        photo=photo, 
        lang_code=language_code  
    )
    if not user_reg:
        success = await gift_most_liked_serial(user=user_reg)
        if success:
            text2 = "За регистрацию Вам подарен самый популярный сериал!"
            text2 = await translate_it([text2], str(language_code))
            await message.answer(text2[0]['text'])

        text = "Хотите указать дату рождения?\nНапишите /birthday {Ваш день рождения в формате 13.06}"
        text = await translate_it([text], str(language_code))
        await message.answer(text[0]['text'])


@user_private.message(F.successful_payment)
async def successful_payment_handler(message: Message):
    successful_payment: SuccessfulPayment = message.successful_payment

    total_amount = successful_payment.total_amount
    currency = successful_payment.currency
    invoice_payload = successful_payment.invoice_payload
    await update_payment_status(int(invoice_payload))



@user_private.pre_checkout_query(lambda query: True)
async def pre_checkout_query(pre_checkout_q: PreCheckoutQuery):
    await bot.answer_pre_checkout_query(pre_checkout_q.id, ok=True)



@user_private.message(Command(commands="birthday"))
async def set_birthday(message: Message):
    birthday_text = message.text.split("/birthday ")[-1].strip()
    
    success_message = "🎉 Дата рождения успешно сохранена!"
    format_error_message = "⛔ Пожалуйста, введите дату рождения в формате DD.MM (например, 13.06)."
    invalid_format_message = "⛔ Неверный формат. Введите дату рождения в формате DD.MM."
    invalid_format_message_birth = "⛔ Вы не можете менять дату рождения"


    if re.match(r"\d{2}\.\d{2}", birthday_text):
        try:
            is_have = await update_user_birthday(message.from_user.id, birthday_text)
            if is_have:
                if is_have == 2:
                    translated_success = await translate_it([invalid_format_message_birth], message.from_user.language_code)
                    await message.answer(translated_success[0]['text'])
                    return
                translated_success = await translate_it([success_message], message.from_user.language_code)
                await message.answer(translated_success[0]['text'])
            else:
                translated_format_error = await translate_it([format_error_message], message.from_user.language_code)
                await message.answer(translated_format_error[0]['text'])
        except ValueError:
            translated_format_error = await translate_it([format_error_message], message.from_user.language_code)
            await message.answer(translated_format_error[0]['text'])
    else:
        translated_invalid_format = await translate_it([invalid_format_message], message.from_user.language_code)
        await message.answer(translated_invalid_format[0]['text'])


@user_private.message(Command("refund"))
async def cmd_refund(message: Message):
    # ID транзакции для рефанда
    # по ней можно понять, какой товар/услугу возвращает человек
    # и по правилам ТГ, вы можете ОТКАЗАТЬ в рефанде
    # но только в том случае, если условия отказа прописаны в Terms of Service вашего бота
    # ...
    # для примера, мы будем разрешать любой возврат звезд в любое время
    text = message.text
    m = text.replace('/refund ', '')
    t_id = m

    # чекаем, указан ли ID транзакции
    if t_id is None:
        await message.answer('Укажите айди')
        return


    await bot.refund_star_payment(
        user_id=message.from_user.id,
        telegram_payment_charge_id=t_id
    )
    await message.answer('Успешно у тебя')

    

