# Generated by Django 5.0.8 on 2024-11-02 12:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0041_alter_startbonus_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='startbonus',
            name='secret_code',
            field=models.CharField(blank=True, default='Generating', max_length=100, verbose_name='Ссылка для копирования'),
        ),
    ]
