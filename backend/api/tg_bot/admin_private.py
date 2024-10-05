from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery, ReplyKeyboardRemove, ContentType
from aiogram.fsm.context import FSMContext
from aiogram.utils.keyboard import InlineKeyboardBuilder, ReplyKeyboardBuilder
from aiogram.types import InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton,WebAppInfo
from aiogram import Bot
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import InputFile

from api.models import Users
from api.tg_bot.database import *
from api.tg_bot.classes_functions import Admin
import api.tg_bot.reply as kb

from asgiref.sync import sync_to_async
from decimal import Decimal 
from openpyxl import Workbook
from PIL import Image
import aiofiles
import openpyxl
import os
from os import getenv, environ
from dotenv import load_dotenv



admin_private = Router()
load_dotenv()
bot = Bot(getenv('BOT_TOKEN'), default=DefaultBotProperties(parse_mode=ParseMode.HTML))

async def send_users_xlsx(chat_id):
    # Создаем новый рабочий файл
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Users Data"

    # Заголовки столбцов
    headers = ["Telegram ID", "Имя пользователя", "Имя", "Страна", "Платная подписка"]
    sheet.append(headers)

    # Получаем данные пользователей
    users = await sync_to_async(list)(Users.objects.all())

    # Заполняем данные пользователей
    for user in users:
        # Получаем страну через sync_to_async
        country_name = await sync_to_async(lambda: user.country.country_name if user.country else "Нет")()
        
        sheet.append([
            user.tg_id,
            user.tg_username,
            user.name,
            country_name,
            "Да" if user.paid else "Нет"
        ])

    # Путь для сохранения файла
    file_path = 'users_data.xlsx'
    workbook.save(file_path)

    # Создаем InputFile для отправки файла, передаем путь к файлу
    input_file = InputFile(path_or_bytesio=file_path)

    # Отправляем файл в Telegram
    await bot.send_document(chat_id=chat_id, document=input_file)

    # Удаляем файл после отправки
    os.remove(file_path)

@admin_private.message(Command('admin'))
async def admin_panel(message: Message):
    is_admin = await check_admin(message.from_user.id)
    await send_users_xlsx(message.from_user.id)
    if is_admin:
        await message.answer('🔒 Админ-панель', reply_markup=kb.admin_panel())

@admin_private.callback_query(F.data == 'statistics')
async def statistics(callback: CallbackQuery):
    await callback.answer()
    all_users = await get_users() 
    active_users = await get_users_status() 
    inactive_users = await get_users_status2() 
    
    total_payments = await get_total_payments()
    today_payments = await get_today_payments()
    week_payments = await get_week_payments()
    month_payments = await get_month_payments()
    
    await callback.message.answer('📊 <b>Статистика</b> \n'
                                  f'Всего пользователей: <b>{all_users}</b> \n'
                                  f'Активных пользователей: <b>{active_users}</b> \n'
                                  f'Неактивных пользователей: <b>{inactive_users}</b> \n'
                                  '\n'
                                  '📦 <b>Покупки</b> \n'
                                  f'Всего покупок: <b>{total_payments}</b>\n'
                                  f'Заказов сегодня: <b>{today_payments}</b>\n'
                                  f'Заказов за неделю: <b>{week_payments}</b>\n'
                                  f'Заказов за месяц: <b>{month_payments}</b>')

@admin_private.callback_query(F.data == 'mailing')
async def post_mailing(callback: CallbackQuery, state: FSMContext):
    await callback.answer()
    await state.set_state(Admin.mailing_state)
    await callback.message.answer('Выберите тип рассылки',reply_markup=kb.post_type())

@admin_private.message(Admin.mailing_state)
async def proccess_text1(message: Message, state: FSMContext):
    if message.text == "Только текст":
        await state.set_state(Admin.mailing_text_only)
    elif message.text == "С фото":
        await state.set_state(Admin.mailing_text)
    await message.answer('Отправьте пост для рассылки',reply_markup=ReplyKeyboardRemove())

@admin_private.message(Admin.mailing_text_only)
async def proccess_text2(message: Message, state: FSMContext):
    await state.update_data(mailing_text=message.text)
    await state.set_state(Admin.ask)
    await message.answer('Добавить кнопку \"<b>Смотреть</b>\"?', reply_markup=kb.set_watch_btn())

@admin_private.message(Admin.mailing_text, F.photo)
async def proccess_text3(message: Message, state: FSMContext):
    await state.update_data(mailing_text=message.caption)
    await state.update_data(mailing_photo=message.photo[-1].file_id)
    await state.set_state(Admin.ask)
    await message.answer('Добавить кнопку \"<b>Смотреть</b>\"?', reply_markup=kb.set_watch_btn())

@admin_private.message(Admin.ask)
async def procces_ask(message: Message, state: FSMContext):
    await state.update_data(ask=message.text)
    data = await state.get_data()
    if 'mailing_photo' in data:
        photo = data['mailing_photo']
        caption = data['mailing_text']
        text = data['ask']

        if not text:
            text = ""

        if not caption:
            caption = ""

        if message.text == 'Да' or  message.text == 'да':
            await state.set_state(Admin.confirm_yes)
            await message.answer_photo(photo=photo, caption=f'{caption} \n'
                                    '\n'
                                    'Все верно?',
                                    reply_markup=kb.choice_button())

        elif message.text == 'Нет' or  message.text == 'нет':
            await state.set_state(Admin.confirm_no)
            
            await message.answer_photo(photo=photo, caption=f'{caption} \n'
                                    '\n'
                                    'Все верно?',
                                    reply_markup=kb.choice_button())
    else:
        caption = data['mailing_text']
        text = data['ask']

        if not caption:
            caption = ""

        if message.text == 'Да' or  message.text == 'да':
            await state.set_state(Admin.confirm_yes)
            await message.answer(text=f'{caption} \n'
                                    '\n'
                                    'Все верно?',
                                    reply_markup=kb.choice_button())

        elif message.text == 'Нет' or  message.text == 'нет':
            await state.set_state(Admin.confirm_no)
            await message.answer(text=f'{caption} \n'
                                    '\n'
                                    'Все верно?',
                                    reply_markup=kb.choice_button())


@admin_private.message(Admin.confirm_yes)
async def procces_post_yes(message: Message, state: FSMContext):
    await state.update_data(confirm_yes=message.text)
    data = await state.get_data()
    text = data['confirm_yes']

    if text == 'Да, выполнить':
        z = await state.get_data()

        users = await get_all_users_tg_id()
        if 'mailing_photo' in data:
            counter = 0
            caption = data['mailing_text']
            photo = data['mailing_photo']
            for user in users:
                await message.bot.send_photo(user['tg_id'], photo=data['mailing_photo'], caption=caption, reply_markup=kb.get_order_post())
                ccounter += 1
            await message.answer('Рассылка завершена \n'
                                f'Отправлено: <b>{counter} сообщений</b>',
                                reply_markup=ReplyKeyboardRemove())
            await message.answer('Вы вернулись в меню', reply_markup=kb.admin_panel())
            await state.clear()
        else:
            counter = 0
            for user in users:
                await message.bot.send_message(user['tg_id'],f'{data["mailing_text"]}',reply_markup=kb.get_order_post())
                counter += 1
            await message.answer('Рассылка завершена \n'
                                f'Отправлено: <b>{counter} сообщений</b>',
                                reply_markup=ReplyKeyboardRemove())
            await message.answer('Вы вернулись в меню', reply_markup=kb.admin_panel())
            await state.clear()

    if text == 'Нет, вернуться':
        await message.answer('Вы вернулись в меню', reply_markup=ReplyKeyboardRemove())
        await message.answer('🔒 Админ-панель', reply_markup=kb.admin_panel())

@admin_private.message(Admin.confirm_no)
async def procces_post_no(message: Message, state: FSMContext):
    await state.update_data(confirm_yes=message.text)
    data = await state.get_data()
    text = data['confirm_yes']

    if text == 'Да, выполнить':
        z = await state.get_data()

        users = await get_all_users_tg_id()

        
        if 'mailing_photo' in data:
            counter = 0
            caption = data['mailing_text']
            photo = data['mailing_photo']
            for user in users:
                await message.bot.send_photo(user['tg_id'], photo=data['mailing_photo'], caption=caption)
                counter += 1
            await message.answer('Рассылка завершена \n'
                                f'Отправлено: <b>{counter} сообщений</b>',
                                reply_markup=ReplyKeyboardRemove())
            await message.answer('Вы вернулись в меню', reply_markup=kb.admin_panel())
            await state.clear()
        else:
            counter = 0
            for user in users:
                await message.bot.send_message(user['tg_id'],f'{data["mailing_text"]}')
                counter += 1
            await message.answer('Рассылка завершена \n'
                                f'Отправлено: <b>{counter} сообщений</b>',
                                reply_markup=ReplyKeyboardRemove())
            await message.answer('Вы вернулись в меню', reply_markup=kb.admin_panel())
            await state.clear()

    if text == 'Нет, вернуться':
        await message.answer('Вы вернулись в меню', reply_markup=ReplyKeyboardRemove())
        await message.answer('🔒 Админ-панель', reply_markup=kb.admin_panel())