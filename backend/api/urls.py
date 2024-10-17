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
)

router = DefaultRouter()
router.register('users', UsersViewSet)
router.register('language', LanguageViewSet)
router.register('country', CountryViewSet)
router.register('genre', GenreViewSet)
router.register('admins', AdminsViewSet)
router.register('serail', SerailViewSet)
router.register('series', SeriesViewSet)
router.register('status-new', StatusNewViewSet)
router.register('comments', CommentsViewSet)
router.register('history', HistoryViewSet)
router.register('documents', DocsTextsViewSet)
router.register('payments', PaymentsViewSet)
router.register('favorite', FavoriteViewSet)




urlpatterns = [
    path('', include(router.urls)),
]
