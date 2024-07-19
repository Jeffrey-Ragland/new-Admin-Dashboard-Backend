# import requests
# import random
# import time

# def generate_sensor_data():
#     return {
#         'projectName': 'TEST1',
#         'level': random.randint(1, 100),
#     }

# def push_sensor_data():
#     url = 'http://localhost:4000/sensor/insertProjectData'
#     while True:
#         sensor_data = generate_sensor_data()
#         try:
#             response = requests.get(url, params=sensor_data)
#             if response.status_code == 200:
#                 print(f"Data inserted successfully: {sensor_data}")
#             else:
#                 print(f"Failed to insert data: {response.status_code}, {response.text}")
#         except requests.exceptions.RequestException as e:
#             print(f"Error connecting to the API: {e}")
#         time.sleep(0.01) 

# if __name__ == "__main__":
#     push_sensor_data()

import requests
import random
import time

def generate_random_data():
    return {f's{i}': random.randint(1, 100) for i in range(1, 7)}

def push_data():
    base_url = 'http://localhost:4000/sensor/insertProjectData'
    project_name = 'TEST1'
    random_data = generate_random_data()

    url = f"{base_url}?projectName={project_name}"
    url += ''.join([f"&{key}={value}" for key, value in random_data.items()])

    response = requests.get(url)
    
    if response.status_code == 201:
        print("Data successfully pushed!")
    else:
        print(f"Failed to push data. Status code: {response.status_code}, Response: {response.text}")

if __name__ == "__main__":
    while True:
        push_data()
        time.sleep(0.01)