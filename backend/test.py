from yookassa import Configuration, Payment
import uuid
import json

Configuration.account_id = '465363'
Configuration.secret_key = 'test_UoRVwVuT-qtHat2h6NW4V2Y3lsRmfFBtapATvT7Vf6s'

idempotence_key = str(uuid.uuid4())

payment = Payment.create({
    "payment_token": "eyJ0eXBlIjoiY2hlY2tvdXRfanNfYmFua19jYXJkIiwiZW5jcnlwdGVkIjoibnlQV1czdHNiU1NUYzBwMWxpcGw3SHBJOWIwbjZicFoxZkRSaG03NytNTjdZUWhUZWFESlNSZUZORm9yaG1mYU5RWS9ZSW1ONkhpR1R4eUNjQklUL2MyRCtpMGtZTHNrTVFwU2REdVhjdGRIU2NPbkJRVEw0T1JBY0pDYjJrOD0iLCJpbml0VmVjdG9yIjoiaUtxU0RjUjZ3UnZBazVlSVZyUXRidz09Iiwia2V5SWQiOiJPak5BQmsvbVRqbmRMa1ZmVHVTUXR3PT0ifQ==",
    "amount": {
        "value": "2.00",
        "currency": "RUB"
    },

    "confirmation": {
        "type": "redirect",
        "return_url": "https://skybox.video/"
    },
    "capture": True,
    "description": "Заказ №72"
}, idempotence_key)

confirmation_url = payment.json()
print(confirmation_url)
