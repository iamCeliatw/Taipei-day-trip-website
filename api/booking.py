from flask import *
from utils.validate import *
from datetime import datetime
from model.booking import Booking

booking = Blueprint('reservation',__name__)

@booking.get('/api/booking')
def book_get():
    try:
        resp = request.cookies.get("token") 
        if not resp:
            return {"error":True,"message":"請先登入會員"},403
        result = Validation.decode_jwt(resp)
        data = Booking.get(result)
        #array 
        if not data:
            return {"data": None}
        return {"data": data[0],"multiple_date":data[1]}
    except Exception as e:
            print(e)
            return {"error": True,"message":"伺服器內部錯誤"},500

@booking.post('/api/booking')
def book_post():
    try:
        #從token 拿使用者資訊
        #從 input 拿booking資訊
        resp = request.cookies.get("token")
        if not resp:
            return {"error":True,"message":"請先點擊右上角，登入會員"},403
        result = Validation.decode_jwt(resp)
        data = request.get_json()
        today = datetime.now().strftime("%Y-%m-%d")
        if data['date'] <= today or data['date'] == '':
            return {"error":True,"message":"⛔️請選擇未來的日期"},400
        res = Booking.post(data,result)
        if res:
            return {"ok":True, "message": "行程已新增成功✅，請至購物車查看"},200
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500

@booking.delete('/api/booking')
def book_delete():
    try:
        resp = request.cookies.get("token")
        print(resp)
        result = Validation.decode_jwt(resp)
        print(result)
        data = request.get_json()
        delete_res = Booking.delete(data,result)
        if delete_res:
            return {'ok':True}
        if not delete_res:
            return {'error':True}
    except Exception as e:
        print('e',e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500
