import openpyxl
from .models import User

def export_users_to_xlsx(filename):
    workbook = openpyxl.Workbook()
    sheet = workbook.active
    sheet.title = 'Users'

    sheet.append(['Telegram ID', 'Имя пользователя', 'Имя'])

    users = User.objects.all()
    for user in users:
        sheet.append([user.tg_id, user.tg_username, user.name])

    workbook.save(filename)
