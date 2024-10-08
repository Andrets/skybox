# Generated by Django 5.0.6 on 2024-09-29 09:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(blank=True, null=True, verbose_name='Текст комментария')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.users')),
            ],
            options={
                'verbose_name': 'Комментарий',
                'verbose_name_plural': 'Комментарии',
            },
        ),
        migrations.CreateModel(
            name='Serail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=500, null=True, verbose_name='Имя')),
                ('vertical_photo', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Вертикальная обложка')),
                ('horizontal_photo0', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка')),
                ('horizontal_photo1', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 2')),
                ('horizontal_photo2', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 3')),
                ('horizontal_photo3', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 4')),
                ('horizontal_photo4', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 5')),
                ('horizontal_photo5', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 6')),
                ('horizontal_photo6', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 7')),
                ('horizontal_photo7', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 8')),
                ('horizontal_photo8', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 9')),
                ('horizontal_photo9', models.ImageField(blank=True, null=True, upload_to='static/media/serail/', verbose_name='Горизонтальная обложка 10')),
                ('rating', models.IntegerField(blank=True, default=0, verbose_name='Рейтинг')),
                ('description', models.TextField(blank=True, null=True, verbose_name='Описание')),
                ('genre', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.genre')),
            ],
            options={
                'verbose_name': 'Пользователь',
                'verbose_name_plural': 'Пользователи',
            },
        ),
        migrations.CreateModel(
            name='History',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.users')),
                ('serail', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.serail')),
            ],
            options={
                'verbose_name': 'История просмотра',
                'verbose_name_plural': 'Истории просмотра',
            },
        ),
        migrations.CreateModel(
            name='Series',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('episode', models.BigIntegerField(verbose_name='Номер эпизода')),
                ('name', models.CharField(max_length=500, verbose_name='Имя серии')),
                ('likes', models.BigIntegerField(default=0, verbose_name='Лайки')),
                ('video', models.FileField(upload_to='series/')),
                ('serail', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.serail')),
            ],
            options={
                'verbose_name': 'Серия',
                'verbose_name_plural': 'Серии',
            },
        ),
        migrations.CreateModel(
            name='StatusNew',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('serail', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.serail')),
            ],
            options={
                'verbose_name': 'Имеет статус "новый"',
                'verbose_name_plural': 'Имеют статус "новый"',
            },
        ),
    ]
