import jwt
from flask import *
from flask_bcrypt import Bcrypt

from api.database import db
from model.sql import *
from model.user import *

member = Blueprint('user',__name__) 
bcrypt = Bcrypt()

#註冊
@member.route('/api/user', methods=["POST"])
def user():
    try:
        data = request.get_json()
        name = data['name']
        email = data['email']
        password = data['password']
        hashed_password = bcrypt.generate_password_hash(password=password)
        sql = 'SELECT * FROM member WHERE email = %s'
        val = [email]
        user = Sql.fetch_one(sql,val)
        if name == '' or email == '' or password == '':
            return {"error": True, "message": "欄位不得為空"}, 400
        elif user:
            return {"error": True, "message": "信箱已被註冊"}, 400
        elif len(password) < 6:
            return {"error":True,"message":"密碼長度至少6字元"},400
        elif not check(email):
            return {"error":True,"message":"email格式不正確"},400
        sql = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
        val = [name, email, hashed_password]
        Sql.execute(sql, val)
        return {"ok":True, "message": "您已註冊成功✅，請登入"}
    except Exception as e: 
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500

#get user
@member.get("/api/user/auth")
def login_get():
    try:
        resp = request.cookies.get("token") 
        if resp is None:
            return {"data":None}
        result = Validation.decode_jwt(resp)
        if result:
            return {"data":result}
    except Exception as e: 
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500

#登入
@member.put("/api/user/auth")
def login_put():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']
        if email == '' or password == '':
            return {"error":True,"message":"欄位不得為空"},400
        elif len(password) < 6:
            return {"error":True,"message":"密碼長度至少6字元"},400
        elif not check(email):
            return {"error":True,"message":"email格式不正確"},400
        sql = "SELECT id, name, email, password FROM member WHERE email = %s "
        val = [email]
        result = Sql.fetch_one(sql,val)
        print(result)
        #hash後的密碼
        hashed_password = result['password']
        #和輸入的密碼做比對
        check_password = bcrypt.check_password_hash(hashed_password, password)
        # print(f'check : {check_password}')
        if result['email'] is None:
            return {"error":True,"message":"Email不存在"},400
        elif not check_password:
            return {"error":True,"message":"密碼錯誤"},400
        resp = Validation.encode_jwt(result['id'])
        return resp
    except Exception as e: 
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500


@member.delete('/api/user/auth')
def user_delete():
    try:
        resp = Validation.delete_jwt()
        return resp 
    except Exception as e: 
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500



