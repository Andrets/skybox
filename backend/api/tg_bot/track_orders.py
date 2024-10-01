from aiogram import Bot
from asgiref.sync import sync_to_async
from api.models import Users, Admins
from api.tg_bot.database import *
from api.tg_bot.user_private import *

import api.tg_bot.reply as kb
import re



async def notify_user(bot: Bot):
    n = await get_msgs()
    tg_ids_to_delete = []

    for el in n:
        msg = el['msg']
        tg_id = int(el['tg_id'])
        if el['tg_id'] == '-4500825826':
            await bot.send_message(chat_id=-4500825826, text=msg)
            tg_ids_to_delete.append(el['tg_id'])
        else:
            await bot.send_message(chat_id=int(el['tg_id']), text=msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            deleted_count = await delete_notifications(tg_id, msg)
            print(deleted_count)
            tg_ids_to_delete.append(el['tg_id'])
    await delete_msgs(tg_ids_to_delete)

