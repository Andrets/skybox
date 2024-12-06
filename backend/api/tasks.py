import threading
from django.utils import timezone
from datetime import timedelta
from .models import StatusNew, Payments, Users, Series, PermissionsModel, ForBirthday, Messages, Orders
import time
import requests
from requests.auth import HTTPBasicAuth
from django.utils.timezone import now

def check_status_new():
    now = timezone.now()
    week_ago = now - timedelta(weeks=1)
    old_status_new_records = StatusNew.objects.filter(added_date__lt=week_ago)
    deleted_count, _ = old_status_new_records.delete()
    print(f'Deleted {deleted_count} old StatusNew records.')

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
            """ Messages.objects.create(
                tg_id=payment.user.tg_id,
                data=f'Ваша подписка истекла. Пожалуйста, обновите свою подписку для продолжения доступа.'
            ) """
            # Деактивируем пользователя
            payment.user.isActive = False
            payment.user.save()


def check_birthdays_and_assign_permissions():
    now = timezone.now()
    users_with_birthday_today = Users.objects.filter(birthday__day=now.day, birthday__month=now.month)

    for user in users_with_birthday_today:
        series = Series.objects.all()
        for serie in series:
            if not PermissionsModel.objects.filter(user=user, series=serie).exists():
                permission = PermissionsModel.objects.create(user=user, series=serie)
                ForBirthday.objects.create(permissionid=permission.id)
def remove_birthday_permissions():
    now = timezone.now()
    expired_time = now - timedelta(hours=24)
    
    expired_birthday_accesses = ForBirthday.objects.filter(created_at__lt=expired_time)
    
    for birthday_access in expired_birthday_accesses:
        try:
            permission = PermissionsModel.objects.get(id=birthday_access.permissionid)
            permission.delete()
        except PermissionsModel.DoesNotExist:
            print(f'Permission ID {birthday_access.permissionid} already deleted or does not exist.')
        
        birthday_access.delete()


def check_payment_status(order_id):
    public_id = 'pk_09a630484c3fe65ceb64733085d2d'
    api_key = 'da9d495d1f33b2f1367a20f14095e5e1'
    data = {"InvoiceId": int(order_id)}

    response = requests.post(
        f"https://api.cloudpayments.ru/v2/payments/find",
        json=data,
        auth=HTTPBasicAuth(public_id, api_key)
    )

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error checking payment status for order {order_id}: {response.text}")
        return {}

def assign_access(user, order):
    existing_payment = Payments.objects.filter(user=user, status=order.status).first()
    if existing_payment:
        print(f"Payment already exists for user {user.id} and order {order.id}")
        return

    new_payment = Payments.objects.create(
        user=user,
        summa=order.summa,
        status=order.status
    )

    if not user.isActive:
        user.isActive = True
        user.paid = True
        user.save()

    if order.status == 'ONCE':
        series_list = Series.objects.filter(serail_id=order.serail_id)
        for series in series_list:
            PermissionsModel.objects.create(series=series, user=user)

    order.delete()



def orders():


    orders_to_check = Orders.objects.filter(
        status__in=['TEMPORARILY_YEAR', 'TEMPORARILY_MONTH', 'TEMPORARILY_WEEK']
    )
    orders_to_check2 = Orders.objects.filter(
        status__in=['ONCE']
    )
    for order in orders_to_check:
        deadline = order.created_at + timedelta(minutes=20)

        if now() <= deadline:
            payment_status = check_payment_status(order.order_id)

            if payment_status.get("Success"):
                assign_access(order.user, order)
            

        else:
            order.delete()

    for order in orders_to_check2:
        deadline = order.created_at + timedelta(minutes=20)

        if now() <= deadline:
            payment_status = check_payment_status(order.order_id)

            if payment_status.get("Success"):
                assign_access(order.user, order)
            

        else:
            order.delete()


def run_reminder_scheduler():
    while True:
        now = timezone.localtime(timezone.now())
        if now.hour == 0 and now.minute == 0:
            check_status_new()
            check_subscription_expiration()
            check_birthdays_and_assign_permissions()
            remove_birthday_permissions()

        time.sleep(60)

def run_reminder_scheduler2():
    while True:
        orders()
        
        time.sleep(2)


def start_scheduler():
    thread = threading.Thread(target=run_reminder_scheduler, daemon=True)
    thread = threading.Thread(target=run_reminder_scheduler2, daemon=True)

    thread.start() 

start_scheduler()
