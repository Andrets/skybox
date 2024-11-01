from aiogram import Router, F
from aiogram.filters import Command
from aiogram.types import Message, CallbackQuery, ReplyKeyboardRemove, ContentType
from aiogram.fsm.context import FSMContext
from aiogram.utils.keyboard import InlineKeyboardBuilder, ReplyKeyboardBuilder
from aiogram.types import InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton,WebAppInfo
from aiogram import Bot
from aiogram.client.bot import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.types import InputFile, FSInputFile

from api.models import Users
from api.tg_bot.database import *
from api.tg_bot.classes_functions import Admin
import api.tg_bot.reply as kb

from asgiref.sync import sync_to_async
from decimal import Decimal 
import django.contrib
from openpyxl import Workbook
from PIL import Image
import aiofiles
import openpyxl
import os

admin_private = Router()

bot = Bot('8090358352:AAHqI7UIDxQSgAr0MUKug8Ixc0OeozWGv7I', default=DefaultBotProperties(parse_mode=ParseMode.HTML))

async def get_users_by_subscription(segment):
    if segment == 'paid':
        return await sync_to_async(list)(Users.objects.filter(paid=True))
    elif segment == 'free':
        return await sync_to_async(list)(Users.objects.filter(paid=False))

async def send_users_xlsx(chat_id):
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Users Data"

    headers = ["Telegram ID", "Имя пользователя", "Имя", "Страна", "Платная подписка"]
    sheet.append(headers)

    users = await sync_to_async(list)(Users.objects.all())

    for user in users:
        country_name = await sync_to_async(lambda: user.country.country_name if user.country else "Нет")()
        
        sheet.append([
            user.tg_id,
            user.tg_username,
            user.name,
            country_name,
            "Да" if user.paid else "Нет"
        ])

    file_path = 'users_data.xlsx'
    workbook.save(file_path)

    input_file = FSInputFile(path=file_path)

    await bot.send_document(chat_id=chat_id, document=input_file)

    os.remove(file_path)

@admin_private.message(Command('admin'))
async def admin_panel(message: Message):
    is_admin = await check_admin(message.from_user.id)
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
                                  '📦 <b>Покупки/Транзакции</b> \n'
                                  f'Всего покупок: <b>{total_payments}</b>\n'
                                  f'Заказов сегодня: <b>{today_payments}</b>\n'
                                  f'Заказов за неделю: <b>{week_payments}</b>\n'
                                  f'Заказов за месяц: <b>{month_payments}</b>')

@admin_private.callback_query(F.data == 'mailing')
async def post_mailing(callback: CallbackQuery, state: FSMContext):
    await callback.answer()
    await state.set_state(Admin.mailing_state_type)
    await callback.message.answer('Выберите тип рассылки',reply_markup=kb.post_type2())

@admin_private.message(Admin.mailing_state_type)
async def choose_mailing_segment(message: Message, state: FSMContext):
    if message.text == "Платные подписчики":
        await state.update_data(segment='paid')
    elif message.text == "Бесплатные подписчики":
        await state.update_data(segment='free')
    await state.set_state(Admin.mailing_state)
    await message.answer('Выберите тип поста для рассылки', reply_markup=kb.post_type())

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
    segment = data.get('segment')

    if text == 'Да, выполнить':
        users = await get_users_by_subscription(segment)  # Получаем список tg_id

        if 'mailing_photo' in data:
            counter = 0
            caption = data['mailing_text']
            photo = data['mailing_photo']

            for user in users:
                tg_id = user.tg_id
                await message.bot.send_photo(tg_id, photo=photo, caption=caption, reply_markup=kb.get_order_post())
                counter += 1

            await message.answer('Рассылка завершена \n'
                                 f'Отправлено: <b>{counter} сообщений</b>',
                                 reply_markup=ReplyKeyboardRemove())
            await message.answer('Вы вернулись в меню', reply_markup=kb.admin_panel())
            await state.clear()
        else:
            counter = 0
            for user in users:
                tg_id = user.tg_id
                await message.bot.send_message(tg_id, f'{data["mailing_text"]}', reply_markup=kb.get_order_post())
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
    segment = data.get('segment')

    if text == 'Да, выполнить':
        users = await get_users_by_subscription(segment)  # Получаем список tg_id

        if 'mailing_photo' in data:
            counter = 0
            caption = data['mailing_text']
            photo = data['mailing_photo']
            for user in users:
                tg_id = user.tg_id
                await message.bot.send_photo(tg_id, photo=photo, caption=caption)
                counter += 1
            await message.answer('Рассылка завершена \n'
                                 f'Отправлено: <b>{counter} сообщений</b>',
                                 reply_markup=ReplyKeyboardRemove())
            await message.answer('Вы вернулись в меню', reply_markup=kb.admin_panel())
            await state.clear()
        else:
            counter = 0
            for user in users:
                tg_id = user.tg_id
                await message.bot.send_message(tg_id, f'{data["mailing_text"]}')
                counter += 1
            await message.answer('Рассылка завершена \n'
                                 f'Отправлено: <b>{counter} сообщений</b>',
                                 reply_markup=ReplyKeyboardRemove())
            await message.answer('Вы вернулись в меню', reply_markup=kb.admin_panel())
            await state.clear()

    if text == 'Нет, вернуться':
        await message.answer('Вы вернулись в меню', reply_markup=ReplyKeyboardRemove())
        await message.answer('🔒 Админ-панель', reply_markup=kb.admin_panel())



@admin_private.callback_query(F.data == 'download_db')
async def download_db(callback: CallbackQuery):
    await callback.answer()
    is_admin = await check_admin(callback.from_user.id)
    if is_admin:
        await send_users_xlsx(callback.from_user.id)




@admin_private.callback_query(F.data == 'controll')
async def controll(callback: CallbackQuery):
    await callback.answer()
    is_admin = await check_admin(callback.from_user.id)
    if is_admin:
        await callback.message.answer('Выберите вариант', reply_markup=kb.price_controll())
    


@admin_private.callback_query(F.data == 'user_present')
async def user_present(callback: CallbackQuery):
    await callback.answer()
    await callback.message.answer(r'Напишите сообщение /update_price {ТИП} {TELEGRAM_ID или ИМЯ ПОЛЬЗОВАТЕЛЯ} {ЦЕНА} {ЦЕНА В TG Stars} '
                                  '\n\nНапример: \n/update_price month 5128389615 100 10\n/update_price year @username 150 15', 
                                  reply_markup=kb.admin_panel())

@admin_private.message(Command('update_price'))
async def user_present_func(message: Message):
    is_admin = await check_admin(message.from_user.id)
    if is_admin:
        text = message.text
        text2 = text.split(' ')
        if len(text2) != 5:
            await message.answer(f'Неправильный формат update_price, повторите попытку', reply_markup=kb.admin_panel())
            return
        
        types = text2[1]  
        user_data = text2[2]  
        price = text2[3]  
        stars_price = text2[4]  

        try:
            new_price_instance = await update_price_personal(types, user_data, price, stars_price)
            await message.answer(f'Изменение цены успешно создано: {new_price_instance}', reply_markup=kb.admin_panel())
        except Exception as e:
            await message.answer(f'Ошибка при создании изменения цены: {str(e)}', reply_markup=kb.admin_panel())


@admin_private.callback_query(F.data == 'group_present')
async def group_present(callback: CallbackQuery):
    await callback.answer()
    await callback.message.answer(r'Напишите сообщение /update_group_price {ТИП} {TGID,TGID,TGID} {ЦЕНА} {ЦЕНА В TG Stars} '
                                  '\n\nНапример: \n/update_group_price month 123456789,987654321 100 10', 
                                  reply_markup=kb.admin_panel())

@admin_private.message(Command('update_group_price'))
async def update_group_price_func(message: Message):
    is_admin = await check_admin(message.from_user.id)
    if is_admin:
        text = message.text
        text2 = text.split(' ')
        
        if len(text2) != 5:
            await message.answer(f'Неправильный формат update_group_price, повторите попытку', reply_markup=kb.admin_panel())
            return
        
        types = text2[1]  # Получаем тип
        user_ids = text2[2].split(',')  # Получаем список TGID
        price = text2[3]  # Получаем цену
        stars_price = text2[4]  # Получаем цену в TG Stars

        # Попробуем создать изменение цены для всех пользователей в списке
        try:
            new_price_instances = []
            for user_id in user_ids:
                new_price_instance = await update_price_personal2(types, user_id, price, stars_price)
                if new_price_instance:
                    new_price_instances.append(new_price_instance)
            
            if new_price_instances:
                await message.answer(f'Изменения цен успешно созданы для {len(new_price_instances)} пользователей.', reply_markup=kb.admin_panel())
            else:
                await message.answer('Не удалось создать изменения цен для указанных пользователей.', reply_markup=kb.admin_panel())
        
        except Exception as e:
            await message.answer(f'Ошибка при создании изменения цен: {str(e)}', reply_markup=kb.admin_panel())


@admin_private.callback_query(F.data == 'update_price')
async def update_price_all(callback: CallbackQuery):
    await callback.answer()
    await callback.message.answer(r'Напишите сообщение /update_all_price {ТИП} {ЦЕНА} {ЦЕНА В TG Stars}\n или\n /update_all_price_serial {ПОЛНОЕ ИМЯ} {ЦЕНА} {ЦЕНА В TG Stars} - для сериала'
                                  '\n\nНапример: \n/update_all_price month 100 10', 
                                  reply_markup=kb.admin_panel())





@admin_private.message(Command('update_all_price'))
async def update_group_price_func(message: Message):
    is_admin = await check_admin(message.from_user.id)
    if is_admin:
        text = message.text
        text2 = text.split(' ')
        
        if len(text2) != 4:
            await message.answer(f'Неправильный формат update_all_price, повторите попытку', reply_markup=kb.admin_panel())
            return
        
        types = text2[1]  
        rubs = text2[2]  
        stars = text2[3]

        try:
            new_price_instance = await update_price_for_all(types, rubs, stars)
            await message.answer(f'Цены успешно изменились', reply_markup=kb.admin_panel())
        except Exception as e:
            await message.answer(f'Ошибка при создании изменения цен: {str(e)}', reply_markup=kb.admin_panel())

@admin_private.message(Command('update_all_price_serial'))
async def update_group_price_func(message: Message):
    is_admin = await check_admin(message.from_user.id)
    if is_admin:
        text = message.text
        text2 = text.split(' ')
        
        if len(text2) != 4:
            await message.answer(f'Неправильный формат update_all_price_serial, повторите попытку', reply_markup=kb.admin_panel())
            return
        
        serail_name = text2[1]  
        rubs = text2[2]  
        stars = text2[3]

        try:
            new_price_instance = await update_price_for_serail(serail_name, rubs, stars)
            await message.answer(f'Цены успешно изменились', reply_markup=kb.admin_panel())
        except Exception as e:
            await message.answer(f'Ошибка при создании изменения цен: {str(e)}', reply_markup=kb.admin_panel())












