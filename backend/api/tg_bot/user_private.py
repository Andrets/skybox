from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, ReplyKeyboardRemove
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import LabeledPrice, PreCheckoutQuery, SuccessfulPayment, ContentType
from aiogram.utils.i18n import gettext as _
from aiogram import Bot
from aiogram.methods.get_user_profile_photos import GetUserProfilePhotos
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode

from asgiref.sync import sync_to_async
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

import os

user_private = Router()

""" from googletrans import Translator

# Создаем экземпляр переводчика
translator = Translator()

# Текст для перевода
text = "Hello, how are you?"

# Определение языка текста
detected_lang = translator.detect(text)
print(f"Определённый язык: {detected_lang.lang}")

# Перевод текста на русский
translated = translator.translate(text, dest='ru')

print(f"Исходный текст: {text}")
print(f"Перевод на русский: {translated.text}") """


bot = Bot('8090358352:AAHqI7UIDxQSgAr0MUKug8Ixc0OeozWGv7I', default=DefaultBotProperties(parse_mode=ParseMode.HTML))

@user_private.message(CommandStart())
async def start_message(message: Message, bot: Bot):
    UserProfilePhotos = await bot.get_user_profile_photos(user_id=message.from_user.id)
    file_id = 0
    photo = ''
    if UserProfilePhotos.total_count > 0:
        first_photo = UserProfilePhotos.photos[0][0]
        file_id = first_photo.file_id
        
        file = await bot.get_file(file_id=file_id)
        file_path = file.file_path
        file_url = f'https://api.telegram.org/file/bot{bot.token}/{file_path}'
        if file_id == 0:
            photo = ''
        else: 
            photo=f'{file_id}.webp'
        save_path = Path('static/media/users') / f'{file_id}.webp'
        save_path.parent.mkdir(parents=True, exist_ok=True)  
        
        async with aiohttp.ClientSession() as session:
            async with session.get(file_url) as response:
                if response.status == 200:
                    with open(save_path, 'wb') as f:
                        f.write(await response.read())

        
    user_reg = await add_user_data(user_id=message.from_user.id, photo=photo, username=message.from_user.username, first_name=message.from_user.first_name, lang=str(message.from_user.language_code))
    print(message.from_user.language_code)
    await message.answer('🎬 Добро пожаловать в SKYBOX!\n'
                         '\n'
                         'Ваш идеальный помощник для просмотра сериалов.\n'
                         '\n'
                         '📺 Здесь вы можете:\n'
                         '— Искать и находить любимые сериалы\n'
                         '— Узнавать последние новинки\n'
                         '— Сохранять и смотреть короткие видео\n'
                         '\n'
                         'Нажмите «Начать», чтобы открыть приложение и насладиться просмотром сериалов!' , reply_markup=kb.start_inline())

