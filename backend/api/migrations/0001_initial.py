# Generated by Django 5.0.6 on 2024-09-28 05:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Admins',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tg_id', models.BigIntegerField(verbose_name='Админы')),
            ],
            options={
                'verbose_name': 'Админ',
                'verbose_name_plural': 'Админы',
            },
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('genre', models.CharField(blank=True, max_length=500, null=True, verbose_name='Имя жанра на анг.')),
            ],
            options={
                'verbose_name': 'Жанр',
                'verbose_name_plural': 'Жанры',
            },
        ),
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lang_name', models.CharField(blank=True, max_length=300, null=True, verbose_name='Имя языка на анг.')),
            ],
            options={
                'verbose_name': 'Язык',
                'verbose_name_plural': 'Языки',
            },
        ),
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country_name', models.CharField(blank=True, max_length=300, null=True, verbose_name='Имя страны на анг.')),
                ('country_lang', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.language')),
            ],
            options={
                'verbose_name': 'Страна',
                'verbose_name_plural': 'Страны',
            },
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tg_id', models.BigIntegerField(verbose_name='Telegram ID')),
                ('tg_username', models.CharField(blank=True, max_length=300, null=True, verbose_name='Имя пользователя')),
                ('name', models.CharField(blank=True, max_length=300, null=True, verbose_name='Имя')),
                ('photo', models.ImageField(null=True, upload_to='static/media/users/', verbose_name='Аватарка пользователя')),
                ('isActive', models.BooleanField(default=False, verbose_name='Активен')),
                ('country', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.country')),
                ('lang', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.language')),
            ],
            options={
                'verbose_name': 'Пользователь',
                'verbose_name_plural': 'Пользователи',
            },
        ),
    ]
