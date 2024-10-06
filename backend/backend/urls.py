from django.contrib import admin
from django.urls import path,include
from django.conf import settings

import os
from rest_framework import permissions, authentication
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="SWYDK API",
        default_version='v1.1.3',
        description="API Service created by Sanzhar Kasymzhomart",
        contact=openapi.Contact(email="sanzhar.kaymzhomart@gmail.com"),
        license=openapi.License(name="SWYDK GROUP LICENSE"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=(authentication.BasicAuthentication,),
)



admin.site.site_header = 'Панель управления SKYBOX'

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/docs/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
