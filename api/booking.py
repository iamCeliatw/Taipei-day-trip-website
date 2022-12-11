from flask import *
from model.validate import *
from datetime import datetime
from model.sql import *

booking = Blueprint('reservation',__name__) 

# @booking.get('/api/booking')
# def book_get():
    
   

    #把時間戳轉換成日期格式
    # timeStamp =int(result['iat']) 
    # dateArray = datetime.datetime.utcfromtimestamp(timeStamp)
    # otherStyleTime = dateArray.strftime("%Y-%m-%d %H:%M:%S")
    # return otherStyleTime

@booking.post('/api/booking')
def book_post():
    try:
        #從token 拿使用者資訊
        #從 input 拿booking資訊
        resp = request.cookies.get("token") 
        if not resp:
            return {"error":True,"message":"請先登入會員"},403
        result = Validation.decode_jwt(resp)
        data = request.get_json()
        today = datetime.now().strftime("%Y-%m-%d")
        if data['date'] <= today:
            return {"error":True,"message":"請選擇未來的日期"},400
        sql = 'INSERT INTO bookingInput (member_id,attractionId,date,time,price) VALUES (%s,%s ,%s ,%s, %s) '
        val = [result['id'],data['attractionId'],data['date'],data['time'],data['price']]
        Sql.execute(sql, val)
        return {"ok":True}
    except Exception as e: 
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500


# @booking.delete('/api/booking')
# def book_delete():
#     return 'ok'