# Generated by Django 5.0.8 on 2024-11-01 04:32

import api.storage_backends
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_alter_users_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='photo',
            field=models.ImageField(null=True, storage=api.storage_backends.VideoStorage(), upload_to='static/media/users/', verbose_name='Аватарка пользователя'),
        ),
    ]