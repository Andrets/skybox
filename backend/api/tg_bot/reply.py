from aiogram.utils.keyboard import InlineKeyboardBuilder, ReplyKeyboardBuilder
from aiogram.types import InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton,WebAppInfo
from api.tg_bot.database import *


def start_inline() -> InlineKeyboardMarkup:

    keyboard = InlineKeyboardBuilder()
    keyboard.button(text=f'👉 Начать', web_app=WebAppInfo(text='Начать', url='https://viking62.ru/'))

    return keyboard.adjust(1).as_markup()

def admin_panel() -> InlineKeyboardMarkup:
    keyboard = InlineKeyboardBuilder()

    keyboard.button(text='Статистика', callback_data='statistics')
    keyboard.button(text='Рассылка', callback_data='mailing')
    keyboard.button(text='Добавить зал', callback_data='add_hall')
    keyboard.button(text='Добавить товар/услугу', callback_data='add_service')
    keyboard.button(text='Удалить зал или товар', callback_data='delete_smth')
    return keyboard.adjust(1).as_markup()

def post_type() -> ReplyKeyboardMarkup:
    keyboard = ReplyKeyboardBuilder()

    keyboard.button(text='Только текст')
    keyboard.button(text='С фото')
    return keyboard.as_markup(resize_keyboard=True)

def set_watch_btn() -> ReplyKeyboardMarkup:
    keyboard = ReplyKeyboardBuilder()

    keyboard.button(text='Да')
    keyboard.button(text='Нет')
    return keyboard.as_markup(resize_keyboard=True)

def choice_button() -> ReplyKeyboardMarkup:
    keyboard = ReplyKeyboardBuilder()

    keyboard.button(text='Да, выполнить')
    keyboard.button(text='Нет, вернуться')
    return keyboard.as_markup(resize_keyboard=True)

def subscription_type() -> InlineKeyboardMarkup:
    keyboard = InlineKeyboardMarkup(row_width=2)
    keyboard.add(
        InlineKeyboardButton("Платные", callback_data="paid"),
        InlineKeyboardButton("Бесплатные", callback_data="free")
    )
    return keyboard