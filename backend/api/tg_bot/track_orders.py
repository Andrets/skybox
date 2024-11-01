import asyncio
from api.models import Messages
from asgiref.sync import sync_to_async
from aiogram import Bot

@sync_to_async
def get_pending_messages():
    return list(Messages.objects.all())

@sync_to_async
def delete_message(message):
    message.delete()

async def notify_user(bot: Bot):
    messages = await get_pending_messages()
    
    for message in messages:
        try:
            await bot.send_message(chat_id=message.tg_id, text=message.data)
            await delete_message(message)
        except Exception as e:
            print(f"Ошибка при отправке сообщения {message.id} пользователю {message.tg_id}: {e}")
