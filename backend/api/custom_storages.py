# custom_storages.py

from storages.backends.s3boto3 import S3Boto3Storage
from django.core.files.storage import FileSystemStorage

class VideoStorage(S3Boto3Storage):
    location = 'videos'  

# Класс для хранения фотографий локально
class PhotoStorage(FileSystemStorage):
    location = 'media/photos' 
    base_url = '/media/photos/' 
