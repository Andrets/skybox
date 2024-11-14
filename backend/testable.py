import requests
import concurrent.futures
import time

from requests.auth import HTTPBasicAuth

URL = 'https://skybox.video/api/serail/get_top_3'
TOTAL_REQUESTS = 5000 
MAX_WORKERS = 500
headers = {
    'InitData': 'query_id%3DAAEjQKQZAAAAACNApBnfL8hM%26user%3D%257B%2522id%2522%253A430194723%252C%2522first_name%2522%253A%2522%25D0%25AF%25D1%2580%25D0%25BE%25D1%2581%25D0%25BB%25D0%25B0%25D0%25B2%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522ExMed0%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26auth_date%3D1729027501%26hash%3D1dfec1782dc680e57198b0abba503c4104196716b627f0d01a9e5c8eef38035a'
}
def send_request(session, url):

    try:
        response = session.get(url, headers=headers)
        if response.status_code!=200:
            ...
        return response.status_code
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

def stress_test():
    start_time = time.time()
    with requests.Session() as session:
        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = [executor.submit(send_request, session, URL) for _ in range(TOTAL_REQUESTS)]
            results = [future.result() for future in concurrent.futures.as_completed(futures)]
    
    end_time = time.time()
    success_count = results.count(200)
    failure_count = len(results) - success_count

    print(f"Total requests: {TOTAL_REQUESTS}")
    print(f"Successful responses: {success_count}")
    print(f"Failed responses: {failure_count}")
    print(f"Time taken: {end_time - start_time:.2f} seconds")


def payments():
    token = "eyJUeXBlIjoiQ2xvdWRDYXJkIiwibWV0YURhdGEiOnsiUGF5bWVudFVybCI6Imh0dHBzOi8vZGV2ZWxvcGVycy5jbG91ZHBheW1lbnRzLnJ1LyIsIlJlZmVycmVyVXJsIjoiaHR0cHM6Ly9kZXZlbG9wZXJzLmNsb3VkcGF5bWVudHMucnUvIn0sIkJyb3dzZXJJbmZvQmFzZTY0IjoiZXlKQlkyTmxjSFJJWldGa1pYSWlPaUlxTHlvaUxDSktZWFpoUlc1aFlteGxaQ0k2Wm1Gc2MyVXNJa3BoZG1GVFkzSnBjSFJGYm1GaWJHVmtJanAwY25WbExDSk1ZVzVuZFdGblpTSTZJbkoxTFZKVklpd2lRMjlzYjNKRVpYQjBhQ0k2SWpJMElpd2lTR1ZwWjJoMElqb2lPRFkwSWl3aVYybGtkR2dpT2lJeE5UTTJJaXdpVkdsdFpWcHZibVVpT2lJdE16QXdJaXdpVlhObGNrRm5aVzUwSWpvaVRXOTZhV3hzWVM4MUxqQWdLRmRwYm1SdmQzTWdUbFFnTVRBdU1Ec2dWMmx1TmpRN0lIZzJOQ2tnUVhCd2JHVlhaV0pMYVhRdk5UTTNMak0ySUNoTFNGUk5UQ3dnYkdsclpTQkhaV05yYnlrZ1EyaHliMjFsTHpFek1DNHdMakF1TUNCVFlXWmhjbWt2TlRNM0xqTTJJbjA9IiwiRm9ybWF0IjoxLCJDYXJkSW5mbyI6eyJGaXJzdFNpeERpZ2l0cyI6IjQyNDI0MiIsIkxhc3RGb3VyRGlnaXRzIjoiNDI0MiIsIkV4cERhdGVZZWFyIjoiMjUiLCJFeHBEYXRlTW9udGgiOiIwMSJ9LCJLZXlWZXJzaW9uIjoiMTMiLCJWYWx1ZSI6InFJYjlhOFBXaUZLWDMwQWhZeDFlc3ZpMlp5eldYTjVWNUthWVFxZW1tV0lhUHF4OVRjQTIyYzg0YlRXd3g0UG5rbXQvWW5qem1xbWFkV3NveHUyYjNnZmlySlVQSDZNUWptQVRsREhDeGhJclVKR1UzMk81V1p0T1BlR3Y4RGFLMm9aZTZmb21BNjN6eTRvMkFlYm9JMGdrU1hjRjFkSWx0a284WFhXdkhzSkFKQU9PSDg1amE5QjZqZHJJRDJ3SzJodkZVb1l6Z2d1SUhJRmRWMG9nWGRaY05lZlhmc0RKY3BJcmVsVUtzaldEQ3A0RWhtRndOQ29OUURjYTlqSElxYkQ0ZnI2a0JrcnhrZnZXRXN5M2MxT1k4UkljV1BOUHhZRE5uN2hROHRDdVpmR1ZyM2JXRHpuUlpCYnNja0FwcW5pSEpuejJBSTJiUFlJMEhoa2lEUT09In0="

    url = "https://api.cloudpayments.ru/payments/cards/charge"
    public_id = 'pk_ce02360aa1279b7999b054b51be53'
    api_key = '4517c9a6ac603d91e1ccef0a475f904a'
    data = {
        "Amount": 1000.0,  # Сумма к оплате
        "Currency": "RUB",  # Валюта
        "IpAddress": "123.123.123.123",  # IP-адрес клиента
        "CardCryptogramPacket": "Криптограмма_карты",  # Данные карты
        "Name": "Иван Иванов",  # Имя владельца карты
    }
    response = requests.post(
        f"https://api.cloudpayments.ru/payments/cards/charge",
        json=data,
        auth=HTTPBasicAuth(public_id, api_key)
    )
    print(response.status_code)
if __name__ == "__main__":
    payments()
