from django.db import models
from .storage_backends import VideoStorage, PhotoStorage

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
    country_lang = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)

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
    photo = models.ImageField('Аватарка пользователя',null=True, upload_to='static/media/users/')
    lang = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True)
    isActive = models.BooleanField('Активен', default=False)
    paid = models.BooleanField('Имел/Имеет платную подписку', default=False)


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
    vertical_photo = models.ImageField('Вертикальная обложка', null=True, storage=PhotoStorage(), upload_to='serail/', blank=True)
    horizontal_photo0 = models.ImageField('Горизонтальная обложка',null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo1 = models.ImageField('Горизонтальная обложка 2', null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo2 = models.ImageField('Горизонтальная обложка 3', null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo3 = models.ImageField('Горизонтальная обложка 4', null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo4 = models.ImageField('Горизонтальная обложка 5', null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo5 = models.ImageField('Горизонтальная обложка 6', null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo6 = models.ImageField('Горизонтальная обложка 7', null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo7 = models.ImageField('Горизонтальная обложка 8', null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo8 = models.ImageField('Горизонтальная обложка 9', null=True, upload_to='static/media/serail/', blank=True)
    horizontal_photo9 = models.ImageField('Горизонтальная обложка 10', null=True, upload_to='static/media/serail/', blank=True)
    
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, related_name='serails')
    rating = models.IntegerField('Рейтинг', default=0, null=False, blank=True)
    description = models.TextField('Описание', null=True, blank=True)

    list_per_page = 500

    def __str__(self):
        return f'{self.name} - {self.genre} с {self.rating} рейтингом'

    class Meta:
        verbose_name = 'Сериал'
        verbose_name_plural = 'Сериалы'

class StatusNew(models.Model):
    serail = models.ForeignKey(Serail, on_delete=models.SET_NULL, null=True, related_name='statusnew')

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
    serail = models.ForeignKey(Serail, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)

    def __str__(self):
        
        return f'{self.user.name}/{self.user.tg_username} - {self.serailerail.name}'

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


class Payments(models.Model):
    user = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    summa = models.BigIntegerField('Сумма оплаты', default=0, null=True)

    list_per_page = 500

    def __str__(self):
        return f'{self.user.name} - {self.summa} USD/USDT'

    class Meta:
        verbose_name = 'Транзакция'
        verbose_name_plural = 'Транзакции'


class ViewedSeries(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    series = models.ForeignKey(Series, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'series') 



