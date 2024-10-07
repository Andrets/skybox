from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage

class VideoStorage(S3Boto3Storage):
    location = 'videos'
    file_overwrite = False  

class PhotoStorage(FileSystemStorage):
    location = 'static/media/photos'