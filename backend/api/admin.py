from django.shortcuts import render, get_object_or_404
from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from django.http import HttpResponseRedirect
from django.core.exceptions import ValidationError
from .models import (
    Users, 
    Language, 
    Country, 
    Admins,
    Genre,
    Serail,
    StatusNew,
    Comments,
    History,
    Series,
    Payments,
    DocsTexts,
    ViewedSeries,
    Favorite,
    PermissionsModel,
    Subscriptions,
    Feasts,
    Newprice,
    SerailPrice,
    UserRating,
    Tokens,
    StartBonus,
    StartBonusSerail,
    SeriesLikes,
)
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.template.defaultfilters import truncatechars
from django.utils.safestring import mark_safe
from datetime import datetime
from django.utils.crypto import get_random_string
admin.site.unregister(Group)
admin.site.unregister(User)


class UsersAdmin(admin.ModelAdmin):
    list_per_page = 500
    list_filter = ['isActive']
    fields = ('tg_id', 'tg_username', 'name', 'birthday', 'photo', 'lang', 'country', 'isActive', 'paid', 'search_history')

    def get_readonly_fields(self, request, obj=None):
        if obj:  
            return ['tg_id','paid']
        return []

    class Meta:
        model = Users

admin.site.register(Users, UsersAdmin)


class LanguageAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('lang_name',)

    class Meta:
        model = Language

admin.site.register(Language, LanguageAdmin)

class CountryAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('country_name', 'country_lang')

    class Meta:
        model = Country

admin.site.register(Country, CountryAdmin)

class AdminsAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('tg_id',)

    class Meta:
        model = Admins

admin.site.register(Admins, AdminsAdmin)

class GenreAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('genre',)

    class Meta:
        model = Genre

admin.site.register(Genre, GenreAdmin)


""" def has_delete_permission(self, request, obj=None):
        return False
    def has_add_permission(self, request):
        return False """

class SeriesInline(admin.TabularInline):
    model = Series
    extra = 1  # Количество пустых форм для добавления новых серий
    fields = ('episode', 'name', 'likes', 'video')
    readonly_fields = ('likes',)

class SerailAdmin(admin.ModelAdmin):
    list_per_page = 500
    list_filter = ['genre']
    search_fields = ['name', 'genre__genre']
    fields = (
        'name',
        'vertical_photo',
        'horizontal_photo0',
        'horizontal_photo1',
        'horizontal_photo2',
        'horizontal_photo3',
        'horizontal_photo4',
        'horizontal_photo5',
        'horizontal_photo6',
        'horizontal_photo7',
        'horizontal_photo8',
        'horizontal_photo9',
        'genre',
        'likes',
        'rating',
        'description',
        'is_original',
        'views',
    )
    inlines = [SeriesInline]


    class Meta:
        model = Serail

admin.site.register(Serail, SerailAdmin)


class SeriesAdmin(admin.ModelAdmin):
    list_per_page = 500
    list_filter = ['serail', 'episode']
    search_fields = ['name', 'serail__name']
    fields = ('serail', 'episode', 'name', 'likes', 'video')
    
    class Meta:
        model = Series

admin.site.register(Series, SeriesAdmin)

class CommentsAdmin(admin.ModelAdmin):
    list_per_page = 500
    list_filter = ['user']
    search_fields = ['user__name', 'text',  'serail']
    fields = ('text', 'user', 'serail')

    class Meta:
        model = Comments

admin.site.register(Comments, CommentsAdmin)

class HistoryAdmin(admin.ModelAdmin):
    list_per_page = 500
    list_filter = ['user', 'serail']
    search_fields = ['user__name', 'serail__name']

    class Meta:
        model = History

admin.site.register(History, HistoryAdmin)

class StatusNewAdmin(admin.ModelAdmin):
    list_per_page = 500
    list_filter = ['serail']
    search_fields = ['serail__name']

    class Meta:
        model = StatusNew

admin.site.register(StatusNew, StatusNewAdmin)


class PaymentsAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('user', 'summa', 'status')

    def get_readonly_fields(self, request, obj=None):
        if obj:  
            return ['user', 'summa', ]
        return []



    class Meta:
        model = Payments

admin.site.register(Payments, PaymentsAdmin)

class DocsTextsAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('name', 'lang', 'text')

    

    class Meta:
        model = DocsTexts

admin.site.register(DocsTexts, DocsTextsAdmin)

class ViewedSeriesAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('user', 'series')

    

    class Meta:
        model = ViewedSeries

admin.site.register(ViewedSeries, ViewedSeriesAdmin)


class PermissionsModelAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('series', 'user')

    

    class Meta:
        model = PermissionsModel

admin.site.register(PermissionsModel, PermissionsModelAdmin)


class FavoriteAdmin(admin.ModelAdmin):
    list_per_page = 500
    fields = ('serail', 'user')

    

    class Meta:
        model = Favorite

admin.site.register(Favorite, FavoriteAdmin)



admin.site.register(Subscriptions)


admin.site.register(Feasts)
admin.site.register(Newprice)
admin.site.register(SerailPrice)
admin.site.register(UserRating)
admin.site.register(Tokens)
admin.site.register(SeriesLikes)






@admin.register(StartBonus)
class StartBonusAdmin(admin.ModelAdmin):
    list_display = ('subtype', 'used', 'secret_code')
    fields = ('subtype', 'used', 'secret_code')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        
        # Если объект создаётся впервые, генерируем секретный код
        if not obj:
            unique_part = get_random_string(10, allowed_chars='abcdefghijlmnopqrstuv1234567')
            form.base_fields['secret_code'].initial = f"https://t.me/skyboxtvbot?start={unique_part}"
        
        return form
    
@admin.register(StartBonusSerail)
class StartBonusSerailAdmin(admin.ModelAdmin):
    list_display = ('serail', 'used', 'secret_code')
    fields = ('serail', 'used', 'secret_code')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        
        # Если объект создаётся впервые, генерируем секретный код
        if not obj:
            unique_part = get_random_string(10, allowed_chars='abcdefghijlmnopqrstuv1234567')
            form.base_fields['secret_code'].initial = f"https://t.me/skyboxtvbot?start={unique_part}"
        
        return form