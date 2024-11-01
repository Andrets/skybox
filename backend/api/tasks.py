import threading
from django.utils import timezone
from datetime import timedelta
from .models import StatusNew, Payments, Users
import time

def check_status_new():
    now = timezone.now()
    week_ago = now - timedelta(weeks=1)
    old_status_new_records = StatusNew.objects.filter(added_date__lt=week_ago)
    deleted_count, _ = old_status_new_records.delete()

def check_subscription_expiration():
    now = timezone.now()
    
    # Получаем все активные платежи, у которых есть срок действия
    payments = Payments.objects.filter(
        status__in=[
            Payments.StatusEnum.TEMPORARILY_YEAR,
            Payments.StatusEnum.TEMPORARILY_MONTH,
            Payments.StatusEnum.TEMPORARILY_WEEK
        ]
    )
    
    for payment in payments:
        # Рассчитываем дату истечения подписки в зависимости от типа
        if payment.status == Payments.StatusEnum.TEMPORARILY_YEAR:
            expiration_date = payment.created_date + timedelta(days=365)
        elif payment.status == Payments.StatusEnum.TEMPORARILY_MONTH:
            expiration_date = payment.created_date + timedelta(days=30)
        elif payment.status == Payments.StatusEnum.TEMPORARILY_WEEK:
            expiration_date = payment.created_date + timedelta(days=7)

        # Если подписка истекла
        if expiration_date <= now:
            # Создаем новую запись в Payments с типом подписки по умолчанию (например, ONCE)
            Payments.objects.create(
                user=payment.user,
                summa=payment.summa,
                status=Payments.StatusEnum.ONCE  # статус для истекших подписок
            )
            
            # Деактивируем пользователя
            payment.user.isActive = False
            payment.user.save()

def run_reminder_scheduler():
    while True:
        now = timezone.localtime(timezone.now())
        
        if now.hour == 0 and now.minute == 0:
            check_status_new()
            check_subscription_expiration()  # Запуск проверки подписок

        time.sleep(60)  

def start_scheduler():
    thread = threading.Thread(target=run_reminder_scheduler, daemon=True)
    thread.start()
