""" import requests
from requests.auth import HTTPBasicAuth

public_id = 'pk_b7bdec8e9c868a7dcd34d04fb3c3d'
api_key = '52d894c1c825b53685850f3a854b7bae'

data = {
    "TransactionId" : 2596681040,
    "PaRes" : "a12ee63b7fc2492e8b9bcca34b3e23fb@2596681040"
}

response = requests.post(
    f"https://api.cloudpayments.ru/payments/cards/post3ds",
    json=data,
    auth=HTTPBasicAuth(public_id, api_key)
)
print(response.json())

 """

import requests

SECRET_KEY = "52d894c1c825b53685850f3a854b7bae"
PUBLIC_ID = "pk_b7bdec8e9c868a7dcd34d04fb3c3d"
PAYMENT_URL = "https://api.cloudpayments.ru/payments/links"

def create_payment_link(amount, description, currency, user_email):
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic " + (SECRET_KEY).encode('ascii').decode('ascii'),
    }
    
    data = {
        "Amount": amount,  # Сумма оплаты
        "Currency": currency,  # Валюта, например, 'RUB'
        "Description": description,  # Описание платежа
        "Email": user_email,  # Email клиента
        "AccountId": "user_123",  # Уникальный ID клиента в вашей системе
    }

    response = requests.post(PAYMENT_URL, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Ошибка: {response.status_code}, {response.text}")
        return None

# Пример использования
payment_link = create_payment_link(1000, "Оплата услуги", "RUB", "example@domain.com")
print(f"Ссылка для оплаты: {payment_link}")
