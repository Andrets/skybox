from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsersViewSet,
    LanguageViewSet,
    CountryViewSet,
    GenreViewSet,
    AdminsViewSet,
    SerailViewSet,
    StatusNewViewSet,
    CommentsViewSet,
    HistoryViewSet,
    SeriesViewSet,
    DocsTextsViewSet,
    PaymentsViewSet,
    FavoriteViewSet,
    SubscriptionsViewSet,
    SerailPriceViewSet,
   # buy_lesson
)


router = DefaultRouter()
router.register('users', UsersViewSet)
router.register('language', LanguageViewSet)
router.register('country', CountryViewSet)
router.register('genre', GenreViewSet)
router.register('serail', SerailViewSet)
router.register('series', SeriesViewSet)
router.register('status-new', StatusNewViewSet)
router.register('comments', CommentsViewSet)
router.register('history', HistoryViewSet)
router.register('documents', DocsTextsViewSet)
router.register('payments', PaymentsViewSet)
router.register('favorite', FavoriteViewSet)
router.register('subscriptions', SubscriptionsViewSet)
router.register('serailprice', SerailPriceViewSet)






urlpatterns = [
    path('', include(router.urls)),
  #  path('buy-lesson/<int:lesson_id>/', buy_lesson, name='buy-lesson'),

]
