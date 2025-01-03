# Generated by Django 5.0.8 on 2024-11-01 04:09

import api.storage_backends
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_remove_tokens_sub'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='photo',
            field=models.ImageField(null=True, storage=api.storage_backends.PhotoStorage(), upload_to='static/media/users/', verbose_name='Аватарка пользователя'),
        ),
    ]
