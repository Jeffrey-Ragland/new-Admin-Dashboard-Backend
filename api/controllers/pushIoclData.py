import requests
import random
import time

def generate_sensor_data():
    return {
        'projectName': 'DEMOKIT01',
        'level': random.randint(1, 100),
    }

def push_sensor_data():
    url = 'http://localhost:4000/sensor/insertDemokitZtarData'
    while True:
        sensor_data = generate_sensor_data()
        try:
            response = requests.get(url, params=sensor_data)
            if response.status_code == 200:
                print(f"Data inserted successfully: {sensor_data}")
            else:
                print(f"Failed to insert data: {response.status_code}, {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"Error connecting to the API: {e}")
        time.sleep(0.01) 

if __name__ == "__main__":
    push_sensor_data()