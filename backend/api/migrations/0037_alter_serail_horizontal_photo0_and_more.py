# Generated by Django 5.0.8 on 2024-11-01 17:54

import api.storage_backends
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_users_photo'),
    ]


    operations = [
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo0',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo1',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 2'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo2',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 3'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo3',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 4'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo4',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 5'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo5',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 6'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo6',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 7'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo7',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 8'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo8',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 9'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='horizontal_photo9',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Горизонтальная обложка 10'),
        ),
        migrations.AlterField(
            model_name='serail',
            name='vertical_photo',
            field=models.ImageField(blank=True, null=True, upload_to='serail/', verbose_name='Вертикальная обложка'),
        ),
        migrations.AlterField(
            model_name='users',
            name='photo',
            field=models.ImageField(null=True, storage=api.storage_backends.PhotoStorage(), upload_to='users/', verbose_name='Аватарка пользователя'),
        ),
    ]
