# Generated by Django 5.0.8 on 2024-10-31 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_tokens_sub'),
    ]

    operations = [
        migrations.AddField(
            model_name='tokens',
            name='is_paid',
            field=models.BooleanField(default=False, verbose_name='Оплачено'),
        ),
    ]
