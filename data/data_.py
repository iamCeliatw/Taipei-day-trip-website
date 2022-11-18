import json

import mysql.connector

db = {
  "host":"localhost",
  "database": "data2",
  "user":     "root",
  "password": "asd24680",
  "port":"3306",
  "charset":"utf8"
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
                                                      pool_size = 4,
                                                      **db)

#開啟json檔案 
with open ('/Users/shuting/taipei-day-trip/data/taipei-attractions.json', encoding='utf-8') as result:
    spot = json.load(result)
    result = spot['result']['results']
    # print(result)

# print(result[1]['name'])
for key in result:
    img = key['file'].split('https://')
    img.pop(0) 
    eachImg = []
    for i in img:
        if i[-3:] in ('JPG','jpg','PNG','png'):
            eachImg.append('https://'+i)
        # print(eachImg)

spotList = []

for key in result:
    spotList.append({
        'id' : key['_id'],
        "name": key['name'],
        "cat" : key['CAT'],
        "description" : key['description'],
        "address" : key['address'],
        "direction" :key['direction'],
        "mrt" :key['MRT'],
        "latitude" :key['latitude'],
        "longitude":key['longitude'],
        'image':eachImg})
# print(spotList)

newResult = json.dumps(spotList, ensure_ascii=False)

# print(newResult)

with open('taipei.attration2.json','w') as f:
    f.write(newResult)


with open('/Users/shuting/taipei-day-trip/data/taipei.attration2.json',encoding='utf-8') as result:
    allSpot = json.load(result)

    # print(allSpot)
    for key in allSpot:
        for i in key['data']:
            spotId = i['id']
            name = i['name']
            cat = i['cat']
            description = i['description']
            direction = i['direction']
            mrt = i['mrt']
            latitude = i['latitude']
            longitude = i['longitude']
            address = i['address']
            image = i['image']
            strImage = "".join(image)
            conn = cnxpool.get_connection()
            cursor = conn.cursor()
            sql = 'INSERT INTO spots(id, name, cat, description, direction, mrt, latitude, longitude, address, image) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
            val = [spotId, name, cat, description, direction, mrt, latitude, longitude, address, strImage]
            cursor.execute(sql,val)
            conn.commit()
            conn.close()
        