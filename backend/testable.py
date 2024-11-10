import requests
import concurrent.futures
import time

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

if __name__ == "__main__":
    stress_test()
