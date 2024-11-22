from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, ReplyKeyboardRemove
from aiogram.filters import CommandStart, Command, CommandObject
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import LabeledPrice, PreCheckoutQuery, SuccessfulPayment, ContentType
from aiogram.types.birthdate import Birthdate 
from aiogram.utils.i18n import gettext as _
from aiogram import Bot
from aiogram.methods.get_user_profile_photos import GetUserProfilePhotos
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from asgiref.sync import sync_to_async
import django.contrib
from googletrans import Translator
from django.db.models import Sum
from aiogram.types import URLInputFile
from api.models import Users, Series, Serail, PermissionsModel, StartBonus
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
from django.core.exceptions import ObjectDoesNotExist
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
async def start_message(message: Message, bot: Bot, command: CommandObject):
    m = await get_user_in_db(message.from_user.id)
    language_code = str(message.from_user.language_code)
    photo_id = "AgACAgIAAxkBAAIDo2c93w9QF8pWbpbddLjcA6uKmn3CAAJ06TEbkz7xSZDyf5fzyfu6AQADAgADeQADNgQ"

    if m:
        if language_code == "ru":
            text = (
                "Привет! Добро пожаловать в SkyboxTV 🎬"
                "Сегодня ты — главный герой своего киноприключения!"
                "Какую историю откроешь сейчас? Решать только тебе! 🌟"
                "Запусти SkyboxTV, и мир микро-сериалов раскроется специально для тебя. Погружайся в захватывающие сюжеты, которые увлекут с первых секунд."
                "Создавай свою коллекцию избранных историй, исследуй новые жанры и находи кинематографические сокровища."
                "А мы будем радовать тебя ежедневными премьерами и эксклюзивным контентом."
                "Не забудь про друзей — приглашай их в SkyboxTV и делитесь яркими эмоциями вместе! 🍿"
                "SkyboxTV — твой личный кинозал в кармане. Начни своё приключение прямо сейчас! 🚀"
            )
            await bot.send_photo(
                chat_id=message.chat.id,
                photo=photo_id,
                caption=text,
                reply_markup=kb.start_inline(language_code)
            )
        elif language_code == "en":
            text = (
                "Hello! Welcome to SkyboxTV 🎬\n"
                "Today, you are the main character of your movie adventure!\n"
                "What story will you discover now? The choice is yours! 🌟\n"
                "Launch SkyboxTV, and the world of micro-series will unfold just for you. Dive into captivating plots that will hook you from the very first second.\n"
                "Create your own collection of favorite stories, explore new genres, and uncover cinematic treasures.\n"
                "We'll delight you with daily premieres and exclusive content.\n"
                "Don't forget about your friends—invite them to SkyboxTV and share bright emotions together! 🍿\n"
                "SkyboxTV is your personal cinema in your pocket. Start your adventure right now! 🚀"
            )
            await bot.send_photo(
                chat_id=message.chat.id,
                photo=photo_id,
                caption=text,
                reply_markup=kb.start_inline(language_code)
            )
        elif language_code == "zh":
            text = (
                "你好！欢迎来到SkyboxTV 🎬\n"
                "今天，你是你自己电影冒险的主角！\n"
                "现在你会选择哪一个故事呢？决定权在你手中！🌟\n"
                "打开SkyboxTV，微型剧集的世界将为你展开。从第一秒起，就沉浸在扣人心弦的情节中。\n"
                "创建你自己的最爱故事收藏，探索新类型，发现电影宝藏。\n"
                "我们每天都会为你带来首映和独家内容。\n"
                "别忘了你的朋友——邀请他们加入SkyboxTV，一起分享精彩的情感！🍿\n"
                "SkyboxTV是你口袋里的私人电影院。现在就开始你的冒险吧！🚀"
            )
            await bot.send_photo(
                chat_id=message.chat.id,
                photo=photo_id,
                caption=text,
                reply_markup=kb.start_inline(language_code)
            )
        elif language_code == "ko":
            text = (
                "안녕하세요! SkyboxTV에 오신 것을 환영합니다 🎬\n"
                "오늘 당신은 자신의 영화 모험의 주인공입니다!\n"
                "지금 어떤 이야기를 선택하시겠습니까? 선택은 당신의 몫입니다! 🌟\n"
                "SkyboxTV를 실행하면 미니 시리즈의 세계가 당신을 위해 열릴 것입니다. 첫 순간부터 몰입하게 되는 흥미진진한 스토리를 즐기세요.\n"
                "자신만의 좋아하는 이야기 컬렉션을 만들고, 새로운 장르를 탐험하며 영화 속 보물을 발견하세요.\n"
                "우리는 매일 새로운 프리미어와 독점 콘텐츠로 당신을 기쁘게 할 것입니다.\n"
                "친구들을 잊지 마세요—그들을 SkyboxTV로 초대하여 함께 멋진 감정을 나누세요! 🍿\n"
                "SkyboxTV는 당신의 주머니 속 개인 영화관입니다. 지금 바로 모험을 시작하세요! 🚀"
            )
            await bot.send_photo(
                chat_id=message.chat.id,
                photo=photo_id,
                caption=text,
                reply_markup=kb.start_inline(language_code)
            )
        elif language_code == "tr":
            text = (
                "Merhaba! SkyboxTV'ye hoş geldiniz 🎬\n"
                "Bugün, kendi film maceranızın baş kahramanısınız!\n"
                "Şimdi hangi hikayeyi keşfedeceksiniz? Karar sizin! 🌟\n"
                "SkyboxTV'yi başlatın ve mikro dizilerin dünyası sizin için açılacak. İlk saniyeden itibaren sizi içine çekecek büyüleyici hikayelere dalın.\n"
                "Kendi favori hikaye koleksiyonunuzu oluşturun, yeni türleri keşfedin ve sinematik hazineleri bulun.\n"
                "Her gün sizi yeni prömiyerler ve özel içeriklerle memnun edeceğiz.\n"
                "Arkadaşlarınızı unutmayın—onları SkyboxTV'ye davet edin ve birlikte harika duyguları paylaşın! 🍿\n"
                "SkyboxTV, cebinizdeki kişisel sinema salonunuzdur. Maceranıza hemen başlayın! 🚀"
            )
            await bot.send_photo(
                chat_id=message.chat.id,
                photo=photo_id,
                caption=text,
                reply_markup=kb.start_inline(language_code)
            )
        elif language_code == "ar":
            text = (
                "مرحباً! أهلاً بك في SkyboxTV 🎬\n"
                "اليوم، أنت بطل مغامرتك السينمائية الخاصة!\n"
                "ما هي القصة التي ستكتشفها الآن؟ الخيار بيدك! 🌟\n"
                "قم بتشغيل SkyboxTV، وسينفتح عالم المسلسلات القصيرة خصيصاً لك. انغمس في القصص المثيرة التي ستأسر انتباهك من اللحظة الأولى.\n"
                "أنشئ مجموعتك الخاصة من القصص المفضلة، واستكشف أنواعاً جديدة، واكتشف الكنوز السينمائية.\n"
                "سنبهرك يومياً بالعروض الأولى والمحتوى الحصري.\n"
                "لا تنسَ أصدقاءك—ادعهم إلى SkyboxTV وشاركوا المشاعر الرائعة معاً! 🍿\n"
                "SkyboxTV هو سينماك الشخصية في جيبك. ابدأ مغامرتك الآن! 🚀"
            )
            await bot.send_photo(
                chat_id=message.chat.id,
                photo=photo_id,
                caption=text,
                reply_markup=kb.start_inline(language_code)
            )

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
                save_path = Path('staticfiles/media/photos') / photo
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
        args = command.args if command.args else None
        if args:
            try:
                start_bonus = await update_code(message.from_user.id, args)
                if start_bonus == 500 or start_bonus == 400:  
                    pass
                else:
                    await message.reply(f"Поздравляем! Бонус активирован! Сообщение от бота: {start_bonus}")

            except ObjectDoesNotExist:
                pass
    else:
        consent_text = {
            "ru": "Согласиться",
            "en": "Agree",
            "zh": "同意",
            "ko": "동의하다",
            "tr": "Kabul et",
            "ar": "موافق"
        }.get(language_code, "Agree")
        args = command.args if command.args else None
        if args:
            consent_keyboard = InlineKeyboardMarkup(
                inline_keyboard=[
                    [InlineKeyboardButton(text=consent_text, callback_data=f"{args}]")]
                ]
            )
        else:
            consent_keyboard = InlineKeyboardMarkup(
                inline_keyboard=[
                    [InlineKeyboardButton(text=consent_text, callback_data="consent_agree")]
                ]
            )
        file_url = "https://skybox.video/api/static/media/photos/privacypolicy.pdf"

        url_file = URLInputFile(file_url, filename="Политика конфиденциальности")
        text4 = "Нажав кнопку, вы соглашаетесь на обработку персональных данных"
        text4 = await translate_it([text4], str(language_code))
        translated_text = text4[0]['text'] 
        await bot.send_document(
            chat_id=message.chat.id,
            document=url_file,
            caption=translated_text,
            reply_markup=consent_keyboard
        )
    
@user_private.callback_query(F.data == 'consent_agree')
async def consent_callback(call: CallbackQuery):
    photo_id = "AgACAgIAAxkBAAIDo2c93w9QF8pWbpbddLjcA6uKmn3CAAJ06TEbkz7xSZDyf5fzyfu6AQADAgADeQADNgQ"
    language_code = str(call.from_user.language_code)

    await call.message.delete()
    if language_code == "ru":
        text = (
            "Привет! Добро пожаловать в SkyboxTV 🎬"
            "Сегодня ты — главный герой своего киноприключения!"
            "Какую историю откроешь сейчас? Решать только тебе! 🌟"
            "Запусти SkyboxTV, и мир микро-сериалов раскроется специально для тебя. Погружайся в захватывающие сюжеты, которые увлекут с первых секунд."
            "Создавай свою коллекцию избранных историй, исследуй новые жанры и находи кинематографические сокровища."
            "А мы будем радовать тебя ежедневными премьерами и эксклюзивным контентом."
            "Не забудь про друзей — приглашай их в SkyboxTV и делитесь яркими эмоциями вместе! 🍿"
            "SkyboxTV — твой личный кинозал в кармане. Начни своё приключение прямо сейчас! 🚀"
        )
        await bot.send_photo(
            chat_id=call.message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "en":
        text = (
            "Hello! Welcome to SkyboxTV 🎬\n"
            "Today, you are the main character of your movie adventure!\n"
            "What story will you discover now? The choice is yours! 🌟\n"
            "Launch SkyboxTV, and the world of micro-series will unfold just for you. Dive into captivating plots that will hook you from the very first second.\n"
            "Create your own collection of favorite stories, explore new genres, and uncover cinematic treasures.\n"
            "We'll delight you with daily premieres and exclusive content.\n"
            "Don't forget about your friends—invite them to SkyboxTV and share bright emotions together! 🍿\n"
            "SkyboxTV is your personal cinema in your pocket. Start your adventure right now! 🚀"
        )
        await bot.send_photo(
            chat_id=call.message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "zh":
        text = (
            "你好！欢迎来到SkyboxTV 🎬\n"
            "今天，你是你自己电影冒险的主角！\n"
            "现在你会选择哪一个故事呢？决定权在你手中！🌟\n"
            "打开SkyboxTV，微型剧集的世界将为你展开。从第一秒起，就沉浸在扣人心弦的情节中。\n"
            "创建你自己的最爱故事收藏，探索新类型，发现电影宝藏。\n"
            "我们每天都会为你带来首映和独家内容。\n"
            "别忘了你的朋友——邀请他们加入SkyboxTV，一起分享精彩的情感！🍿\n"
            "SkyboxTV是你口袋里的私人电影院。现在就开始你的冒险吧！🚀"
        )
        await bot.send_photo(
            chat_id=call.message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "ko":
        text = (
            "안녕하세요! SkyboxTV에 오신 것을 환영합니다 🎬\n"
            "오늘 당신은 자신의 영화 모험의 주인공입니다!\n"
            "지금 어떤 이야기를 선택하시겠습니까? 선택은 당신의 몫입니다! 🌟\n"
            "SkyboxTV를 실행하면 미니 시리즈의 세계가 당신을 위해 열릴 것입니다. 첫 순간부터 몰입하게 되는 흥미진진한 스토리를 즐기세요.\n"
            "자신만의 좋아하는 이야기 컬렉션을 만들고, 새로운 장르를 탐험하며 영화 속 보물을 발견하세요.\n"
            "우리는 매일 새로운 프리미어와 독점 콘텐츠로 당신을 기쁘게 할 것입니다.\n"
            "친구들을 잊지 마세요—그들을 SkyboxTV로 초대하여 함께 멋진 감정을 나누세요! 🍿\n"
            "SkyboxTV는 당신의 주머니 속 개인 영화관입니다. 지금 바로 모험을 시작하세요! 🚀"
        )
        await bot.send_photo(
            chat_id=call.message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "tr":
        text = (
            "Merhaba! SkyboxTV'ye hoş geldiniz 🎬\n"
            "Bugün, kendi film maceranızın baş kahramanısınız!\n"
            "Şimdi hangi hikayeyi keşfedeceksiniz? Karar sizin! 🌟\n"
            "SkyboxTV'yi başlatın ve mikro dizilerin dünyası sizin için açılacak. İlk saniyeden itibaren sizi içine çekecek büyüleyici hikayelere dalın.\n"
            "Kendi favori hikaye koleksiyonunuzu oluşturun, yeni türleri keşfedin ve sinematik hazineleri bulun.\n"
            "Her gün sizi yeni prömiyerler ve özel içeriklerle memnun edeceğiz.\n"
            "Arkadaşlarınızı unutmayın—onları SkyboxTV'ye davet edin ve birlikte harika duyguları paylaşın! 🍿\n"
            "SkyboxTV, cebinizdeki kişisel sinema salonunuzdur. Maceranıza hemen başlayın! 🚀"
        )
        await bot.send_photo(
            chat_id=call.message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "ar":
        text = (
            "مرحباً! أهلاً بك في SkyboxTV 🎬\n"
            "اليوم، أنت بطل مغامرتك السينمائية الخاصة!\n"
            "ما هي القصة التي ستكتشفها الآن؟ الخيار بيدك! 🌟\n"
            "قم بتشغيل SkyboxTV، وسينفتح عالم المسلسلات القصيرة خصيصاً لك. انغمس في القصص المثيرة التي ستأسر انتباهك من اللحظة الأولى.\n"
            "أنشئ مجموعتك الخاصة من القصص المفضلة، واستكشف أنواعاً جديدة، واكتشف الكنوز السينمائية.\n"
            "سنبهرك يومياً بالعروض الأولى والمحتوى الحصري.\n"
            "لا تنسَ أصدقاءك—ادعهم إلى SkyboxTV وشاركوا المشاعر الرائعة معاً! 🍿\n"
            "SkyboxTV هو سينماك الشخصية في جيبك. ابدأ مغامرتك الآن! 🚀"
        )
        await bot.send_photo(
            chat_id=call.message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    UserProfilePhotos = await bot.get_user_profile_photos(user_id=call.from_user.id)
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
            save_path = Path('staticfiles/media/photos') / photo
            save_path.parent.mkdir(parents=True, exist_ok=True)  
            
            async with aiohttp.ClientSession() as session:
                async with session.get(file_url) as response:
                    if response.status == 200:
                        with open(save_path, 'wb') as f:
                            f.write(await response.read())
    user_reg = await add_user_data(
        tg_id=call.from_user.id, 
        tg_username=call.from_user.username, 
        name=call.from_user.first_name, 
        photo=photo, 
        lang_code=language_code
    )
    if call.data != "consent_agree":
        try:
            start_bonus = await update_code(call.message.chat.id, call.data)
            if start_bonus == 500 or start_bonus == 400:  
                pass
            else:
            
                await call.message.chat.id(chat_id=call.message.chat.id, text=f"Поздравляем! Бонус активирован! Сообщение от бота: {start_bonus}")
        except ObjectDoesNotExist:
            pass
    
    

    if user_reg:
        success = await gift_most_liked_serial(user=user_reg)
        if success:
            text2 = "За регистрацию Вам подарен самый популярный сериал!"
            text2 = await translate_it([text2], str(language_code))
            await bot.send_message(chat_id=call.message.chat.id, text=text2[0]['text'])

        text = "Хотите указать дату рождения?\nНапишите /birthday {Ваш день рождения в формате 13.06}"
        text = await translate_it([text], str(language_code))
        await bot.send_message(chat_id=call.message.chat.id, text=text[0]['text'])
#deep_link=True
""" @user_private.message(CommandStart())
async def start_message(message: Message, bot: Bot, command: CommandObject):
    photo_id = "AgACAgIAAxkBAAIDo2c93w9QF8pWbpbddLjcA6uKmn3CAAJ06TEbkz7xSZDyf5fzyfu6AQADAgADeQADNgQ"
    language_code = str(message.from_user.language_code)
    if language_code == "ru":
        text = (
            "Привет! Добро пожаловать в SkyboxTV 🎬"
            "Сегодня ты — главный герой своего киноприключения!"
            "Какую историю откроешь сейчас? Решать только тебе! 🌟"
            "Запусти SkyboxTV, и мир микро-сериалов раскроется специально для тебя. Погружайся в захватывающие сюжеты, которые увлекут с первых секунд."
            "Создавай свою коллекцию избранных историй, исследуй новые жанры и находи кинематографические сокровища."
            "А мы будем радовать тебя ежедневными премьерами и эксклюзивным контентом."
            "Не забудь про друзей — приглашай их в SkyboxTV и делитесь яркими эмоциями вместе! 🍿"
            "SkyboxTV — твой личный кинозал в кармане. Начни своё приключение прямо сейчас! 🚀"
        )
        await bot.send_photo(
            chat_id=message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "en":
        text = (
            "Hello! Welcome to SkyboxTV 🎬\n"
            "Today, you are the main character of your movie adventure!\n"
            "What story will you discover now? The choice is yours! 🌟\n"
            "Launch SkyboxTV, and the world of micro-series will unfold just for you. Dive into captivating plots that will hook you from the very first second.\n"
            "Create your own collection of favorite stories, explore new genres, and uncover cinematic treasures.\n"
            "We'll delight you with daily premieres and exclusive content.\n"
            "Don't forget about your friends—invite them to SkyboxTV and share bright emotions together! 🍿\n"
            "SkyboxTV is your personal cinema in your pocket. Start your adventure right now! 🚀"
        )
        await bot.send_photo(
            chat_id=message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "zh":
        text = (
            "你好！欢迎来到SkyboxTV 🎬\n"
            "今天，你是你自己电影冒险的主角！\n"
            "现在你会选择哪一个故事呢？决定权在你手中！🌟\n"
            "打开SkyboxTV，微型剧集的世界将为你展开。从第一秒起，就沉浸在扣人心弦的情节中。\n"
            "创建你自己的最爱故事收藏，探索新类型，发现电影宝藏。\n"
            "我们每天都会为你带来首映和独家内容。\n"
            "别忘了你的朋友——邀请他们加入SkyboxTV，一起分享精彩的情感！🍿\n"
            "SkyboxTV是你口袋里的私人电影院。现在就开始你的冒险吧！🚀"
        )
        await bot.send_photo(
            chat_id=message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "ko":
        text = (
            "안녕하세요! SkyboxTV에 오신 것을 환영합니다 🎬\n"
            "오늘 당신은 자신의 영화 모험의 주인공입니다!\n"
            "지금 어떤 이야기를 선택하시겠습니까? 선택은 당신의 몫입니다! 🌟\n"
            "SkyboxTV를 실행하면 미니 시리즈의 세계가 당신을 위해 열릴 것입니다. 첫 순간부터 몰입하게 되는 흥미진진한 스토리를 즐기세요.\n"
            "자신만의 좋아하는 이야기 컬렉션을 만들고, 새로운 장르를 탐험하며 영화 속 보물을 발견하세요.\n"
            "우리는 매일 새로운 프리미어와 독점 콘텐츠로 당신을 기쁘게 할 것입니다.\n"
            "친구들을 잊지 마세요—그들을 SkyboxTV로 초대하여 함께 멋진 감정을 나누세요! 🍿\n"
            "SkyboxTV는 당신의 주머니 속 개인 영화관입니다. 지금 바로 모험을 시작하세요! 🚀"
        )
        await bot.send_photo(
            chat_id=message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "tr":
        text = (
            "Merhaba! SkyboxTV'ye hoş geldiniz 🎬\n"
            "Bugün, kendi film maceranızın baş kahramanısınız!\n"
            "Şimdi hangi hikayeyi keşfedeceksiniz? Karar sizin! 🌟\n"
            "SkyboxTV'yi başlatın ve mikro dizilerin dünyası sizin için açılacak. İlk saniyeden itibaren sizi içine çekecek büyüleyici hikayelere dalın.\n"
            "Kendi favori hikaye koleksiyonunuzu oluşturun, yeni türleri keşfedin ve sinematik hazineleri bulun.\n"
            "Her gün sizi yeni prömiyerler ve özel içeriklerle memnun edeceğiz.\n"
            "Arkadaşlarınızı unutmayın—onları SkyboxTV'ye davet edin ve birlikte harika duyguları paylaşın! 🍿\n"
            "SkyboxTV, cebinizdeki kişisel sinema salonunuzdur. Maceranıza hemen başlayın! 🚀"
        )
        await bot.send_photo(
            chat_id=message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )
    elif language_code == "ar":
        text = (
            "مرحباً! أهلاً بك في SkyboxTV 🎬\n"
            "اليوم، أنت بطل مغامرتك السينمائية الخاصة!\n"
            "ما هي القصة التي ستكتشفها الآن؟ الخيار بيدك! 🌟\n"
            "قم بتشغيل SkyboxTV، وسينفتح عالم المسلسلات القصيرة خصيصاً لك. انغمس في القصص المثيرة التي ستأسر انتباهك من اللحظة الأولى.\n"
            "أنشئ مجموعتك الخاصة من القصص المفضلة، واستكشف أنواعاً جديدة، واكتشف الكنوز السينمائية.\n"
            "سنبهرك يومياً بالعروض الأولى والمحتوى الحصري.\n"
            "لا تنسَ أصدقاءك—ادعهم إلى SkyboxTV وشاركوا المشاعر الرائعة معاً! 🍿\n"
            "SkyboxTV هو سينماك الشخصية في جيبك. ابدأ مغامرتك الآن! 🚀"
        )
        await bot.send_photo(
            chat_id=message.chat.id,
            photo=photo_id,
            caption=text,
            reply_markup=kb.start_inline(language_code)
        )

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
            save_path = Path('staticfiles/media/photos') / photo
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
    args = command.args if command.args else None
    if args:
        try:
            start_bonus = await update_code(message.from_user.id, args)
            if start_bonus == 500 or start_bonus == 400:  
                pass
            else:
            
                await message.reply(f"Поздравляем! Бонус активирован! Сообщение от бота: {start_bonus}")
        
        except ObjectDoesNotExist:
            pass
    
    

    text4 = "Нажав кнопку start, Вы приняли согласие на обработку персональных данных"
    text4 = await translate_it([text4], str(language_code))
    await message.answer(text4[0]['text'])
    if user_reg:
        success = await gift_most_liked_serial(user=user_reg)
        if success:
            text2 = "За регистрацию Вам подарен самый популярный сериал!"
            text2 = await translate_it([text2], str(language_code))
            await message.answer(text2[0]['text'])

        text = "Хотите указать дату рождения?\nНапишите /birthday {Ваш день рождения в формате 13.06}"
        text = await translate_it([text], str(language_code))
        await message.answer(text[0]['text'])


 """
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


