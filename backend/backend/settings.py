
from pathlib import Path
from datetime import timedelta 
import os

# Настройки S3
# AWS S3 настройки
""" AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME') # ваше имя бакета
AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME')  # ваш регион

# Настройка хранилища
DEFAULT_FILE_STORAGE = 'storages.backends.s3.S3Boto3'
AWS_S3_ENDPOINT_URL = os.environ.get('AWS_S3_ENDPOINT_URL') # ваш URL

# Дополнительные параметры, если нужно
AWS_S3_CUSTOM_DOMAIN = os.environ.get('AWS_S3_CUSTOM_DOMAIN') """
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']
CSRF_TRUSTED_ORIGINS = ['https://skybox.video']
BOT_TOKEN = ''

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',

    'rest_framework',
    'corsheaders',
    'drf_yasg',

    'storages',

]


SWAGGER_SETTINGS = {
   'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',

]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]






CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://skybox.video',

]


WSGI_APPLICATION = 'backend.wsgi.application'



DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': 'postgresql',
        'PORT': 5432,
    }
}



AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]



LANGUAGE_CODE = 'ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_TZ = True


STATIC_URL = '/api/staticfiles/'
STATIC_ROOT = '/app/staticfiles/'
# Настройки хранения медиафайлов
MEDIA_URL = '/api/static/media/'
MEDIA_ROOT = '/app/staticfiles/media/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'



AWS_ACCESS_KEY_ID = 'NH9Q3XYBHSIYLCBX1VAV'
AWS_SECRET_ACCESS_KEY = 'mDvlC5tUkiD9Lrr04a38phKl52SBgRgDd1E5ACg3'
AWS_STORAGE_BUCKET_NAME = 'db3c5564-9df7e9c8-879a-46bd-ba04-f363ec17e9d0'
AWS_S3_ENDPOINT_URL = 'https://s3.timeweb.cloud'  
AWS_S3_REGION_NAME = 'ru-1'  
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.timeweb.cloud'

DEFAULT_FILE_STORAGE = 'api.storage_backends.VideoStorage'
