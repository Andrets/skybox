# Generated by Django 5.0.8 on 2024-10-28 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_feasts'),
    ]

    operations = [
        migrations.CreateModel(
            name='Newprice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.JSONField(default=list, verbose_name='Список')),
                ('updtype', models.CharField(choices=[('PERSONAL', 'PERSONAL'), ('GROUP', 'GROUP')], max_length=300, verbose_name='Тип изменения')),
                ('month', models.CharField(default=0, max_length=300, verbose_name='За месяц')),
                ('year', models.CharField(default=0, max_length=300, verbose_name='За год')),
            ],
            options={
                'verbose_name': 'Акции',
                'verbose_name_plural': 'Акции',
            },
        ),
    ]