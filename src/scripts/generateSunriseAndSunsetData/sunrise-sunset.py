import json

# 假设你的JSON数据保存在一个名为data.json的文件中
with open('A-B0062-001.json', 'r') as file:
    data = json.load(file)

# 提取数据
for location in data['cwaopendata']['dataset']['location']:
    for time_info in location['time']:
        date = time_info['Date']
        sunrise = time_info['SunRiseTime']
        sunset = time_info['SunSetTime']
        print(f"Date: {date}, Sunrise: {sunrise}, Sunset: {sunset}")

