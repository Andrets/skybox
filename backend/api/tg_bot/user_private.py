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

from api.models import Users
from api.tg_bot.database import  *
from api.tg_bot.classes_functions import Admin
import api.tg_bot.reply as kb

from pathlib import Path
from datetime import datetime
from os import getenv, environ
from dotenv import load_dotenv

from django.db.models import Q
from datetime import datetime, timedelta

import requests
import aiohttp
import json
import re
import os

user_private = Router()


bot = Bot('8090358352:AAHqI7UIDxQSgAr0MUKug8Ixc0OeozWGv7I', default=DefaultBotProperties(parse_mode=ParseMode.HTML))



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
    """ if not user_reg:
        text = "Хотите указать дату рождения?\n Напишите /birthday {Ваш день рождения в формате 13.06}"
        text = await translate_it(text, language_code)
        await message.answer(text) """


@user_private.message(F.successful_payment)
async def successful_payment_handler(message: Message):
    successful_payment: SuccessfulPayment = message.successful_payment

    total_amount = successful_payment.total_amount  # Сумма платежа
    currency = successful_payment.currency  # Валюта платежа
    invoice_payload = successful_payment.invoice_payload  # Полезная нагрузка

    await update_payment_status(int(invoice_payload))



@user_private.pre_checkout_query(lambda query: True)
async def pre_checkout_query(pre_checkout_q: PreCheckoutQuery):
    await bot.answer_pre_checkout_query(pre_checkout_q.id, ok=True)

    

@user_private.message(Command(commands="birthday"))
async def set_birthday(message: Message):
    birthday_text = message.text.split("/birthday ")[-1].strip()
    
    # Translation messages
    success_message = "🎉 Дата рождения успешно сохранена!"
    format_error_message = "⛔ Пожалуйста, введите дату рождения в формате DD.MM (например, 13.06)."
    invalid_format_message = "⛔ Неверный формат. Введите дату рождения в формате DD.MM."

    if re.match(r"\d{2}\.\d{2}", birthday_text):
        try:
            await update_user_birthday(message.from_user.id, birthday_text)
            translated_success = await translate_it(success_message, message.from_user.language_code)
            await message.answer(translated_success)
        except ValueError:
            translated_format_error = await translate_it(format_error_message, message.from_user.language_code)
            await message.answer(translated_format_error)
    else:
        translated_invalid_format = await translate_it(invalid_format_message, message.from_user.language_code)
        await message.answer(translated_invalid_format)


