import json

import mysql.connector

db = {
  "host":"localhost",
  "database": "data",
  "user":     "root",
  "password": "asd24680",
  "port":"3306",
  "charset":"utf8"
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
                                                      pool_size = 4,
                                                      **db)
#test sql connection 
def prem(db):
    conn = cnxpool.get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT VERSION()')
    data = cursor.fetchone()
    print("Database version: %s" % data) #成功印出表連接成功


#開啟json檔案 
with open ('/Users/shuting/taipei-day-trip/data/taipei-attractions.json', encoding='utf-8') as result:
    spot = json.load(result)
    result = spot['result']['results']
    # print(result)
page = 1
countSpot = 0 #計算景點數 超過換頁
spotLength = 0 #景點的總數
nextPage = [] 
spotList = []

# print(result[1]['name'])
for key in result:
    countSpot += 1 
    spotLength += 1 
    #把url分開變成陣列
    img = key['file'].split('https://')
    img.pop(0) 
    eachImg = []
    for i in img:
        if i[-3:] in ('JPG','jpg','PNG','png'):
            eachImg.append('https://'+i)
            #大於12筆資料 下一頁
            # countSpot =13時變成1, 1+11 countSpot=12 再+1>12換頁 
    if countSpot > 12:
        countSpot = 1
        nextPage.append({'nextPage':page,'data':spotList})
        page +=1 
        spotList = []
        spotList.append({ 'id' : key['_id'],
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
    else:
        spotList.append({'id' : key['_id'],
        "name": key['name'],
        "cat" : key['CAT'],
        "description" : key['description'],
        "address" : key['address'],
        "direction" :key['direction'],
        "mrt" :key['MRT'],
        "latitude" :key['latitude'],
        "longitude":key['longitude'],
        'image':eachImg})
        if spotLength == len(result):
            nextPage.append({'nextPage':None,'data':spotList})


newResult = json.dumps(nextPage, ensure_ascii=False)


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
        