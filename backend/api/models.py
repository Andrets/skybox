from django.db import models
import rest_framework
from .storage_backends import VideoStorage, PhotoStorage
from django.utils.translation import gettext_lazy as _

class Language(models.Model):
    lang_name = models.CharField('Имя языка на анг.', null=True, max_length=300, blank=True)

    list_per_page = 500

    def __str__(self):
        return str(self.lang_name)

    class Meta:
        verbose_name = 'Язык'
        verbose_name_plural = 'Языки'


class Country(models.Model):
    country_name = models.CharField('Имя страны на анг.',null=True, max_length=300, blank=True)
    country_lang = models.ForeignKey(Language, on_delete=models.CASCADE, null=True)

    list_per_page = 500

    def __str__(self):
        return f'{self.country_name}'

    class Meta:
        verbose_name = 'Страна'
        verbose_name_plural = 'Страны'


class Users(models.Model):
    
    tg_id = models.BigIntegerField('Telegram ID')
    tg_username = models.CharField('Имя пользователя',null=True, max_length=300, blank=True)
    name = models.CharField('Имя', max_length=300,null=True, blank=True)
    photo = models.ImageField('Аватарка пользователя',null=True, upload_to='users/', storage=PhotoStorage())
    lang = models.ForeignKey(Language, on_delete=models.CASCADE, null=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True)
    isActive = models.BooleanField('Активен', default=False)
    paid = models.BooleanField('Имел/Имеет платную подписку', default=False)
    search_history = models.JSONField(default=list, verbose_name='История поиска')
    birthday = models.CharField('Дата рождения', max_length=250, null=True)
    list_per_page = 500

    def __str__(self):
        return f'{self.name}/{self.tg_username} из {self.country}'

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class Admins(models.Model):
    tg_id = models.BigIntegerField('Админы')

    list_per_page = 500

    def __str__(self):
        return f'{self.tg_id}'

    class Meta:
        verbose_name = 'Админ'
        verbose_name_plural = 'Админы'


class Genre(models.Model):
    genre = models.CharField('Имя жанра на анг.', null=True, max_length=500, blank=True)

    list_per_page = 500

    def __str__(self):
        return str(self.genre)

    class Meta:
        verbose_name = 'Жанр'
        verbose_name_plural = 'Жанры'


class Serail(models.Model):
    
    name = models.CharField('Имя', max_length=500, null=True, blank=True)
    lang = models.ForeignKey(Language, on_delete=models.CASCADE, null=True)
    vertical_photo = models.ImageField('Вертикальная обложка', null=True, upload_to='serail/',  blank=True)
    horizontal_photo0 = models.ImageField('Горизонтальная обложка',null=True, upload_to='serail/', blank=True)
    horizontal_photo1 = models.ImageField('Горизонтальная обложка 2', null=True, upload_to='serail/', blank=True)
    horizontal_photo2 = models.ImageField('Горизонтальная обложка 3', null=True, upload_to='serail/', blank=True)
    horizontal_photo3 = models.ImageField('Горизонтальная обложка 4', null=True, upload_to='serail/', blank=True)
    horizontal_photo4 = models.ImageField('Горизонтальная обложка 5', null=True, upload_to='serail/', blank=True)
    horizontal_photo5 = models.ImageField('Горизонтальная обложка 6', null=True, upload_to='serail/', blank=True)
    horizontal_photo6 = models.ImageField('Горизонтальная обложка 7', null=True, upload_to='serail/', blank=True)
    horizontal_photo7 = models.ImageField('Горизонтальная обложка 8', null=True, upload_to='serail/', blank=True)
    horizontal_photo8 = models.ImageField('Горизонтальная обложка 9', null=True, upload_to='serail/', blank=True)
    horizontal_photo9 = models.ImageField('Горизонтальная обложка 10', null=True, upload_to='serail/', blank=True)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, null=True, related_name='serails')
    rating = models.CharField('Рейтинг', max_length=500, null=True, blank=True)
    likes = models.BigIntegerField('Лайки', default=0, null=True)
    description = models.TextField('Описание', null=True, blank=True)
    is_original = models.BooleanField('Является оригиналом', default=False)
    views = models.BigIntegerField('Просмотры', default=0)

    list_per_page = 500

    def __str__(self):
        return f'{self.name} - {self.genre} с {self.rating} рейтингом'

    class Meta:
        verbose_name = 'Сериал'
        verbose_name_plural = 'Сериалы'


class StatusNew(models.Model):
    serail = models.ForeignKey(Serail, on_delete=models.CASCADE, null=True, related_name='statusnew')
    added_date = models.DateField('Дата добавления статуса', auto_now_add=True)
    list_per_page = 500

    def __str__(self):
        return f'{self.serail.name}'

    class Meta:
        verbose_name = 'Имеет статус \"новый\"'
        verbose_name_plural = 'Имеют статус \"новый\"'


class Comments(models.Model):
    serail = models.ForeignKey(Serail, on_delete=models.CASCADE, null=True, related_name='comments')
    text = models.TextField('Текст комментария', null=True, blank=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    list_per_page = 500

    def __str__(self):
        comment_excerpt = (self.text[:16] + '...') if self.text else '...'
        
        return f'{self.user.name}: {comment_excerpt}'

    class Meta:
        verbose_name = 'Комментарий'
        verbose_name_plural = 'Комментарии'


class History(models.Model):
    serail = models.ForeignKey(Serail, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.name}/{self.user.tg_username} - {self.serail.name}'

    class Meta:
        verbose_name = 'История просмотра'
        verbose_name_plural = 'Истории просмотра'


class Series(models.Model):
    serail = models.ForeignKey(Serail, on_delete=models.CASCADE, null=True)
    episode = models.BigIntegerField('Номер эпизода', null=False)
    name = models.CharField('Имя серии', max_length=500, null=False)
    likes = models.BigIntegerField('Лайки', default=0, )
    video = models.FileField(upload_to='series/', storage=VideoStorage())

    list_per_page = 500

    def __str__(self):
        return f'{self.serail.name}/{self.name} - {self.episode} эпизод'

    class Meta:
        verbose_name = 'Серия'
        verbose_name_plural = 'Серии'


class PermissionsModel(models.Model):
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    list_per_page = 500

    def __str__(self):
        return f'{self.series.name} - {self.user.tg_username}'

    class Meta:
        verbose_name = 'Доступ'
        verbose_name_plural = 'Доступы'


class Payments(models.Model):
    class StatusEnum(models.TextChoices):
        TEMPORARILY_YEAR = 'TEMPORARILY_YEAR', _('TEMPORARILY_YEAR')
        TEMPORARILY_MONTH = 'TEMPORARILY_MONTH', _('TEMPORARILY_MONTH')
        TEMPORARILY_WEEK = 'TEMPORARILY_WEEK', _('TEMPORARILY_WEEK')

        ALWAYS = 'ALWAYS', _('ALWAYS')
        ONCE = 'ONCE', _('ONCE')
        
    user = models.ForeignKey(Users, on_delete=models.CASCADE, null=True)
    summa = models.BigIntegerField('Сумма оплаты', default=0, null=True)
    status = models.CharField('Тип', choices=StatusEnum.choices, max_length=250)

    created_date = models.DateTimeField(auto_now_add=True)
    list_per_page = 500

    def __str__(self):
        return f'{self.status} - {self.summa} руб.'

    class Meta:
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'


class ViewedSeries(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    series = models.ForeignKey(Series, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):

        return f'{self.user.tg_username} уже посмотрел {self.series.name}'

    class Meta:
        unique_together = ('user', 'series') 
        verbose_name = 'Просмотр'
        verbose_name_plural = 'Просмотры'


class DocsTexts(models.Model):
    class StatusEnum(models.TextChoices):
        TERMS_OF_USE = 'TERMS_OF_USE', _('TERMS_OF_USE')
        PRIVACY_POLICY = 'PRIVACY_POLICY', _('PRIVACY_POLICY')
        DMCA = 'DMCA', _('DMCA')

    name = models.CharField('Имя', choices=StatusEnum.choices, max_length=250)
    lang = models.ForeignKey(Language, on_delete=models.CASCADE, null=True)
    text = models.TextField('Текст документа', null=True, blank=True)

    list_per_page = 500

    def __str__(self):

        return f'{self.name} на {self.lang}'

    class Meta:
        verbose_name = 'Документ'
        verbose_name_plural = 'Документы'


class Favorite(models.Model):
    serail = models.ForeignKey(Serail, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    def __str__(self):
        
        return f'{self.serail.name} - {self.user.tg_username}'

    class Meta:
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранные'


class Subscriptions(models.Model):
    class StatusEnum(models.TextChoices):
        TEMPORARILY_YEAR = 'TEMPORARILY_YEAR', _('TEMPORARILY_YEAR')
        TEMPORARILY_MONTH = 'TEMPORARILY_MONTH', _('TEMPORARILY_MONTH')
        TEMPORARILY_WEEK = 'TEMPORARILY_WEEK', _('TEMPORARILY_WEEK')
        ALWAYS = 'ALWAYS', _('ALWAYS')
        ONCE = 'ONCE', _('ONCE')

    subtype = models.CharField('Тип подписки', choices=StatusEnum.choices, max_length=300)
    price = models.CharField('Цена в руб', default='0', max_length=300)
    stars_price = models.CharField('Цена в tg stars', default='0', max_length=300)
    percent = models.CharField('Скидка для рубля', default='0', max_length=250)
    stars_percent = models.CharField('Скидка для tg stars', default='0', max_length=250)

    def __str__(self):
        
        return f'{self.subtype} - {self.price} руб./{self.stars_price} stars'

    class Meta:
        verbose_name = 'Подписка'
        verbose_name_plural = 'Подписки'


class Feasts(models.Model):
    name = models.CharField('Название', max_length=300)
    date = models.DateField('День праздника')
    percent = models.CharField('Процент скидки', default='0', max_length=300)
    stars_percent = models.CharField('Скидка для tg stars', default='0', max_length=300)

    def __str__(self):
        return f'{self.name} - {self.date} c {self.percent}%'

    class Meta:
        verbose_name = 'Праздник'
        verbose_name_plural = 'Праздник'


class Newprice(models.Model):
    class StatusEnum(models.TextChoices):
        PERSONAL = 'PERSONAL', _('PERSONAL')
        GROUP = 'GROUP', _('GROUP')

    class StatusEnum2(models.TextChoices):
        TEMPORARILY_YEAR = 'TEMPORARILY_YEAR', _('TEMPORARILY_YEAR')
        TEMPORARILY_MONTH = 'TEMPORARILY_MONTH', _('TEMPORARILY_MONTH')
        TEMPORARILY_WEEK = 'TEMPORARILY_WEEK', _('TEMPORARILY_WEEK')

    data = models.JSONField(default=list, verbose_name='Список')
    updtype = models.CharField('Тип изменения', choices=StatusEnum.choices, max_length=300)
    periodtype = models.CharField('Тип периода', choices=StatusEnum2.choices, max_length=300)
    price = models.CharField('Цена в руб', default='0', max_length=300)
    stars_price = models.CharField('Цена в tg stars', default='0', max_length=300)
    list_per_page = 500

    def __str__(self):
        return f'Изменения цен {self.id} - {self.updtype}'

    class Meta:
        verbose_name = 'Акции'
        verbose_name_plural = 'Акции'


class SerailPrice(models.Model):
    serail = models.ForeignKey(Serail, on_delete=models.CASCADE, null=True)
    price = models.CharField('Цена в руб', default='0', max_length=300)
    stars_price = models.CharField('Цена в tg stars', default='0', max_length=300)

    list_per_page = 500

    def __str__(self):
        return f'{self.serail.name} - {self.price} руб/{self.stars_price} stars'

    class Meta:
        verbose_name = 'Цена на сериал'
        verbose_name_plural = 'Цены на сериалы'


class UserRating(models.Model):
    serail = models.ForeignKey(Serail, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    rating = models.CharField('Рейтинг', max_length=500, null=True, blank=True)

    def __str__(self):
        return f'{self.serail.name} - {self.user.tg_username}'

    class Meta:
        verbose_name = 'Рейтинг'
        verbose_name_plural = 'Рейтинги'

class Tokens(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    payloadtoken = models.BigIntegerField('Токен', null=True, blank=True)
    is_paid = models.BooleanField('Оплачено', default=False)

    def __str__(self):
        return f'{self.payloadtoken} - {self.user.tg_username}'

    class Meta:
        verbose_name = 'Токен'
        verbose_name_plural = 'Токены'


class Messages(models.Model):
    tg_id = models.CharField('TG ID', max_length=300)
    data = models.TextField('Text')

    def __str__(self):
        return f'{self.payloadtoken} - {self.user.tg_username}'

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'


class ForBirthday(models.Model):
    permissionid = models.BigIntegerField('ID доступа')
    created_at = models.DateTimeField(auto_now_add=True)
    