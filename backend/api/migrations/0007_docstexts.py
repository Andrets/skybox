# Generated by Django 5.0.8 on 2024-10-10 15:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_users_search_history'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocsTexts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('TERMS_OF_USE', 'TERMS_OF_USE'), ('PRIVACY_POLICY', 'PRIVACY_POLICY'), ('DMCA', 'DMCA')], max_length=250, verbose_name='Статус')),
                ('text', models.TextField(blank=True, null=True, verbose_name='Текст документа')),
                ('lang', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.language')),
            ],
            options={
                'verbose_name': 'Документ',
                'verbose_name_plural': 'Документы',
            },
        ),
    ]
