from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, ReplyKeyboardRemove
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
import json
from asgiref.sync import sync_to_async
import requests
from geopy.geocoders import Nominatim
import main.tg_bot.reply as kb
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import LabeledPrice, PreCheckoutQuery, SuccessfulPayment, ContentType
from aiogram.utils.i18n import gettext as _
from main.tg_bot.classes_functions import Admin
from main.models import User, Orders,Order_list

from main.tg_bot.database import (fetch_order_by_id, fetch_orders, count_orders, get_users_status, get_users, get_pos)
from main.tg_bot.database import add_phone_number, add_user, create_order,d_success,get_order_by_id,do_paid

user_private = Router()


import uuid

from yookassa import Configuration, Payment

Configuration.account_id = '289119'
Configuration.secret_key = 'test_eUXMP4FptkXeMLTg4Sd4XD9ODUfoAjvddfQhgKB4EII'

YOOKASSA_SHOP_ID = '506751'
YOOKASSA_SECRET_KEY = '381764678:TEST:91042'
""" 
PAYMENTS_PROVIDER_TOKEN = '381764678:TEST:90774'
 """

def create(prices,chat_id):
    idempotence_key = str(uuid.uuid4())
    payment = Payment.create({
            "amount": {
                "value": f"{prices}",
                "currency": "RUB"
            },
            "payment_method_data": {
                "type": "bank_card"
            },
            "capture":True,
            "confirmation": {
                "type": "redirect",
                "return_url": "https://t.me/pizzafresca_bot"
            },
            "metadata": {
                "chat_id": chat_id,
            },
            "description": f"Заказ в PIZZA FRESKA"
        },  idempotence_key)

        
    
    confirmation_url = payment.confirmation.confirmation_url

    return confirmation_url , payment.id

def check(payment_id):
    payment = Payment.find_one(payment_id)
    if payment.status == 'succeeded':
        return False
    else:
        return payment.metadata

@user_private.callback_query(F.data.startswith("order_d_"))
async def order_delivered_point(callback: CallbackQuery):
    order_id = callback.data.split("_")[2]
    is_delivered_updated = await d_success(order_id=order_id)

    await callback.answer("Заказ помечен как доставленный.")
    await callback.message.edit_reply_markup()



    

@user_private.message(CommandStart())
async def start_message(message: Message):
    await add_user(message.from_user.id)
    await message.answer('Добро пожаловать в <b>Pizza Fresca</b>! Здесь ты \n'
                         'можешь: \n'
                         '\n'
                         '🍕 Заказать пиццу, десерт, суп и много \n'
                         'всего другого! \n'
                         '\n'
                         '🚚 Заказать доставку \n'
                         '\n'
                         '🔎 Смотреть статусы заказов \n'
                         '\n'
                         'Скорее жми кнопку <b>Начать</b>, чтобы открыть \n'
                         'меню',reply_markup=kb.start_menu)


@user_private.message(lambda message: message.web_app_data)
async def pickuap(message: Message, state: FSMContext):
    data = message.web_app_data.data
    parsed_data = json.loads(data)
    await state.update_data(order_data=data)

    summa = parsed_data["Order"]["info"]["summa"]
    await message.answer(f'Заказ получен')

    await message.answer(f'Ты оформил(а) заказ на сумму <b>{summa}</b>₽\n\nВыбери удобный способ получения:',
                         reply_markup=kb.shipping_method())


@user_private.message(F.text == '📍 Самовывоз')
async def pickup(message: Message, state: FSMContext):
    await state.set_state(Admin.number)
    await state.update_data(get_way='Самовывоз')

    await state.update_data(address='Самовывоз')
    await state.update_data(time_data='Самовывоз')

    await message.answer('Отправь свой контактный номер\n'
                         'телефона', reply_markup=kb.get_number)


@user_private.message(F.text == '🚚 Доставка')
async def delivery(message: Message, state: FSMContext):
    await state.set_state(Admin.geo)
    await state.update_data(get_way='Доставка')

    await message.answer('Напиши свой адрес или \n'
                         'отправь геолокацию', reply_markup=kb.get_geo)


@user_private.message(Admin.geo, F.text)
async def proccess_geo(message: Message, state: FSMContext):
    if message.text.lower() == 'вернуться в меню':
        await state.clear()
        await message.answer('Вы вернулись в меню', reply_markup=ReplyKeyboardRemove())
        await start_message(message)
    else:
        address = message.text
        await state.update_data(address=address)
        await state.set_state(Admin.time_data)

        await message.answer('Напиши, в какую дату и время \n'
                             'доставить заказ \n'
                             '\n'
                             '<b>Режим работы доставки:</b> \n'
                             'ПН-ПТ 10:00-21:30 \n'
                             'СБ-ВС 11:00-22:30 \n'
                             '+7(999) 999-99-21', reply_markup=kb.fast_delivery())


@user_private.message(Admin.geo, F.location)
async def process_geo(message: Message, state: FSMContext):
    location = message.location
    latitude = str(location.latitude)
    longitude = str(location.longitude)
    url = f"https://geocode-maps.yandex.ru/1.x/?apikey=bcdcf8db-2ba0-4f7a-a73e-0148e88921e9&geocode={longitude},{latitude}&format=json"
    response = requests.get(url)
    data = response.json()
    if response.status_code == 200:
        data = response.json()
        try:
            address = data['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['metaDataProperty']['GeocoderMetaData']['text']
        except (IndexError, KeyError):
            address = "не найден"
    else:
        address = "Ошибка запроса"
   
    await state.update_data(address=address)
    await state.set_state(Admin.geo2)
    await message.answer(f'Ваш адрес {address}. Давайте уточним номер и(или) квартиру. Введите в формате д. 14 кв. 45.',reply_markup=kb.skip_geo2())

    # Обработать нажатие кнопки
    if message.text == 'Как можно скорее':
        pass

@user_private.message(Admin.geo2)
async def proccess_geo(message: Message, state: FSMContext):
    data = await state.get_data()
    ad = data['address']
    if message.text != "Пропустить":
        address = ad + " " + message.text
    else:
        address = ad
    await state.update_data(address=address)
    await state.set_state(Admin.time_data)

    await message.answer('Напиши, в какую дату и время \n'
                         'доставить заказ \n'
                         '\n'
                         '<b>Режим работы доставки:</b> \n'
                         'ПН-ПТ 10:00-21:30 \n'
                         'СБ-ВС 11:00-22:30 \n'
                          '+7(999) 999-99-21', reply_markup=kb.fast_delivery())


@user_private.message(Admin.time_data)
async def procces_time_data(message: Message, state: FSMContext):
    if message.text == 'Вернуться':
        await state.clear()
        await message.answer('Вы вернулисьв меню', reply_markup=ReplyKeyboardRemove())
        await start_message(message)
    else:
        await state.update_data(time_data=message.text)
        await state.set_state(Admin.number)
        await message.answer('Отправь свой контактный номер\n'
                             'телефона', reply_markup=kb.get_number)


@user_private.message(Admin.number, F.contact)
async def proccess_number(message: Message, state: FSMContext):
    text = message.text
    if message.text == "Вернуться":
        await state.clear()
        await message.answer('Вы вернулись в меню', reply_markup=ReplyKeyboardRemove())
        await start_message(message)
    else:
        contact = message.contact.phone_number
        await state.update_data(number=contact)
        await state.set_state(Admin.comment)
        await message.answer('Напиши комментарий к заказу или пропусти этот шаг',
                             reply_markup=kb.get_comment())


@user_private.message(Admin.number)
async def proccess_number(message: Message, state: FSMContext):
    text = message.text

    if message.text == "Вернуться":
        await state.clear()
        await message.answer('Вы вернулись в меню', reply_markup=ReplyKeyboardRemove())
        await start_message(message)
    else:
        contact = message.text
        await state.update_data(number=contact)
        await state.set_state(Admin.comment)
        await message.answer('Напиши комментарий к заказу или пропусти этот шаг',
                             reply_markup=kb.get_comment())


@user_private.message(Admin.comment)
async def proccess_comment(message: Message, state: FSMContext):
    text = message.text

    if text == 'Вернуться':
        await state.clear()
        await message.answer('Вы вернулись в меню', reply_markup=ReplyKeyboardRemove())
        await start_message(message)
    elif text == 'Пропустить':
        await state.set_state(Admin.payment)
        await state.update_data(comment='Без комментрариев')

        await message.answer('Как удобнее оплатить заказ?', reply_markup=kb.payments())
    else:
        await state.update_data(comment=message.text)
        await state.set_state(Admin.payment)
        await message.answer('Как удобнее оплатить заказ?', reply_markup=kb.payments())



@user_private.callback_query(F.data.startswith('check_'))
async def check_it(callback: CallbackQuery):
    tg_id = callback.from_user.id
    result = check(callback.data.split('_')[-1])

    order = callback.data.split('_')[-2]
    await callback.answer()

    await do_paid(order)

    if result:
        await callback.message.answer('Ошибка')

    else:
        await callback.message.edit_text('✅ Спасибо за покупку! Я буду \n'
                             'присылать тебе уведомления \n'
                             'об изменениях статуса заказа')


@user_private.message(Admin.payment)
async def proccess_payment(message: Message, state: FSMContext):
    text = message.text

    if text == 'Вернуться':
        await state.clear()
        await message.answer('Вы вернулись в меню', reply_markup=ReplyKeyboardRemove())
        await start_message(message)

    elif text == 'Юкасса':

        await state.update_data(payment=message.text)

        await state.update_data(user_tg_id=message.from_user.id)
        data = await state.get_data()
        # Здесь хранятся все стейты, дальше нужно обработать
        # data = await state.get_data()
        

        prices = 0
        order_data = json.loads(data['order_data'])
        f = await create_order(data)

        for key, value in order_data['Order'].items():
            if key.startswith('Position'):
                for el in range(value['quantity']):
                    price_in_cents = int(float(value['price']))  # Преобразование цены в копейки
                    prices += price_in_cents
        
        order_id = await get_order_by_id()
        order_id = int(order_id[0]['id'])
        
        await message.answer(f'Получение платежа',reply_markup=ReplyKeyboardRemove())
        """ await message.bot.send_invoice(
            chat_id=message.chat.id,
            title='PIZZA FRESKA',
            description='Пиццерия',
            payload='some-invoice-payload-for-our-internal-use',
            provider_token=PAYMENTS_PROVIDER_TOKEN,
            currency='RUB',
            prices=prices,
            start_parameter='example'
        ) """
        
        
       
        confirmation_url,pay_id = create(prices, message.from_user.id)
        await message.answer(f'Получени',reply_markup=kb.get_pay(confirmation_url,prices,pay_id,order_id))
       

        await add_phone_number(message.from_user.id, data['number'])
        
        await state.clear()
    elif text == 'При получении':
        
        await state.update_data(payment=message.text)
        await state.update_data(paid=False)

        await state.update_data(user_tg_id=message.from_user.id)
        data = await state.get_data()
        # Здесь хранятся все стейты, дальше нужно обработать
        # data = await state.get_data()

        # Обработать нажатие данной клавиши
        f = await create_order(data)
        await add_phone_number(message.from_user.id, data['number'])
        # Обработать нажатие данной клавиши
        await message.answer('✅ Спасибо за заказ! Я буду \n'
                             'присылать тебе уведомления \n'
                             'об изменениях статуса заказа',
                             reply_markup=ReplyKeyboardRemove())
        await state.clear()


@user_private.message(F.text == 'Мои заказы ℹ️')
async def my_orders(message: Message, state: FSMContext):
    tg_id = message.from_user.id
    await message.answer('Мот заказы', reply_markup=ReplyKeyboardRemove())
    await message.answer('Вот список твоих заказов:', reply_markup=await kb.list_orders(tg_id))


@user_private.callback_query(F.data.startswith('next_page_') | F.data.startswith('prev_page_'))
async def change_page(callback: CallbackQuery):
    tg_id = callback.from_user.id
    await callback.answer()
    new_page = int(callback.data.split('_')[-1])
    await callback.message.edit_reply_markup(reply_markup=await kb.list_orders(tg_id, new_page))


@user_private.callback_query(F.data.startswith('order_'))
async def order_information(callback: CallbackQuery):
    order_id = int(callback.data.split('_')[-1])
    order = await fetch_order_by_id(order_id)

    order = order[0]

    posl = ""

    positions = await get_pos(order["id"])
    for el in range(len(positions)):
        s = str(positions[el]["id"]) + ". " + str(positions[el]["name"]) + ", " + str(positions[el]["price"])
        posl = posl + s + "\n"

    if order["status"] == "CK":
        order["status"] = "Готовится"
    elif order["status"] == "DL":
        order["status"] = "В доставке"
    elif order["status"] == "RC":
        order["status"] = "Доставлен"

    await callback.answer()
    await callback.message.answer(f'ℹ️ <b>Информация о заказе #{order["id"]}</b> \n'
                                  '\n'
                                  f'<b>Дата</b>: {order["date"]} \n'
                                  f'<b>Статус</b>: {order["status"]} \n'
                                  '\n'
                                  '<b>Позиции</b>: \n'
                                  f'{posl} \n'
                                  '\n'
                                  f'<b>Итого</b>: {order["summa"]}р')
