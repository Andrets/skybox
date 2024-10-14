import threading
from django.utils import timezone
from datetime import timedelta
from .models import StatusNew 
import time

def check_status_new():
    now = timezone.now()
    
    week_ago = now - timedelta(weeks=1)
    
    old_status_new_records = StatusNew.objects.filter(added_date__lt=week_ago)
    
    deleted_count, _ = old_status_new_records.delete()


def run_reminder_scheduler():
    while True:
        now = timezone.localtime(timezone.now())
        
        if now.hour == 0 and now.minute == 0:
            check_status_new()

        time.sleep(60)  

def start_scheduler():
    thread = threading.Thread(target=run_reminder_scheduler, daemon=True)
    thread.start()
