# Generated by Django 5.0.8 on 2024-10-31 05:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_userrating'),
    ]

    operations = [
        migrations.AlterField(
            model_name='favorite',
            name='serail',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='api.serail'),
        ),
    ]
