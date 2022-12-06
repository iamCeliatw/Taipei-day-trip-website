from datetime import datetime, timedelta, timezone

import jwt
from flask import *

from component.database import db

#blueprint setup
api = Blueprint('myApi',__name__, url_prefix='/api')
 
@api.route('/categories')
def cat():
    try:
        conn = db.connection.get_connection()
        #取值不重複
        sql = "SELECT DISTINCT `cat` FROM `spots` "
        cursor = conn.cursor(buffered=True)
        cursor.execute(sql)
        result = cursor.fetchall()
        catList = []
        for i in result:
            catList.append(i[0])
        cursor.close()
        conn.close()
        return jsonify({'data':catList})
    except:
        return jsonify({'error': True,'message':"伺服器內部錯誤"}),500

@api.route('/attractions')
def attraction_spot():
    try:
        args = request.args
        page = args.get("page", type=int, default=0)
        keyword = args.get("keyword", default='')
        if keyword == '':
            perpage = 13
            # 第一頁 取 0~13 第二頁 取 第13~25（13筆）
            offset = page * (perpage-1)
            conn = db.connection.get_connection()
            sql = "SELECT sid,id,name,cat,description,direction,mrt,address,latitude,longitude, image FROM `spots` LIMIT %s OFFSET %s"
            val = [perpage, offset]
            cursor = conn.cursor(dictionary=True)
            cursor.execute(sql, val)
            result = cursor.fetchall()
            imgs = []
            for i in result:
                img = i['image'].split('https://')
                for j in range(len(img)):
                    img[j] = 'https://' + img[j]
                img.pop(0)
                imgs.append(img)
            cursor.close()
            conn.close()
            for i in range(len(result)):
                result[i]['image'] = imgs[i]
            if len(result) < 13:
                return jsonify({'nextPage': None, 'data':result})
            result = result[:-1]
            return jsonify({'nextPage': page+1, 'data':result})

        else:
            perpage = 13
            offset = page * (perpage-1)
            conn = db.connection.get_connection()
            sql = "SELECT sid,id,name,cat,description,direction,mrt,address,latitude,longitude, image FROM `spots` WHERE `cat` = %s or name LIKE %s LIMIT %s OFFSET %s"
            val = [keyword, "%"+f"{keyword}"+"%", perpage, offset]
            cursor = conn.cursor(buffered=True, dictionary=True)
            cursor.execute(sql, val)
            result = cursor.fetchall()
            imgs = []
            for i in result:
                img = i['image'].split('https://')
                for j in range(len(img)):
                    img[j] = 'https://' + img[j]
                img.pop(0)
                imgs.append(img)
            cursor.close()
            conn.close()
            for i in range(len(result)):
                result[i]['image'] = imgs[i]
            if len(result) < 13:
                return jsonify({'nextPage': None,'data':result})
            result = result[:-1]
            return jsonify({'nextPage': page+1,'data':result})
    except:
        return jsonify({'error': True, 'message': "伺服器內部錯誤"}), 500


@api.route("attraction/<id>")
def attraction(id):
    try:
        conn = db.connection.get_connection()
        sql1 = 'SELECT image FROM `spots` WHERE `id` = %s'
        val1 = [id]
        cursor = conn.cursor(buffered=True)
        cursor.execute(sql1, val1)
        result = cursor.fetchone()
        if result is not None:
            str = ''.join(result)
            img = str.split('https://')
            img.pop(0)
            arrImg = []
            for i in img:
                arrImg.append('https://' + i)
            sql2 = "SELECT sid, id , name, cat, description, direction, mrt, address, latitude, longitude FROM `spots` WHERE `id` = %s "
            val2 = [id]
            cursor = conn.cursor(buffered=True, dictionary=True)
            cursor.execute(sql2, val2)
            all_result = cursor.fetchone()
            # 新增照片網址的陣列
            all_result.setdefault('image', arrImg)
            cursor.close()
            conn.close()
            return jsonify({'data': all_result})
        else:
            return jsonify({"error": True, "message": "景點編號不正確"}), 400
    except:
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500



@api.route('user', methods=["POST"])
def user():
    # try:
        data = request.get_json()
        name = data['name']
        email = data['email']
        password = data['password']
        # print(data)
        sql = 'SELECT * FROM member WHERE email = %s'
        val = [email]
        conn = db.connection.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql,val)
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if name == '' or email == '' or password == '':
            return {"error": True, "message": "欄位不得為空"}, 400
        elif user:
            return {"error": True, "message": "信箱已被註冊"}, 400
        elif len(password) < 6:
                  return {"error":True,"message":"密碼長度至少6字元"},400
        sql = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
        val = [name, email, password]
        conn = db.connection.get_connection()
        cursor = conn.cursor()
        cursor.execute(sql, val)
        conn.commit()
        cursor.close()
        conn.close()
        return {"ok":True,  "message": "您已註冊成功✅，請登入"}
    # except:

    #     return {"error": True, "message": "伺服器內部錯誤"}, 500

@api.route('user/auth',methods=["GET","PUT","DELETE"])
def user_auth():
    try:
     # 轉換時區 -> 東八區  
        dt1 = datetime.utcnow().replace(tzinfo=timezone.utc)
        now = dt1.astimezone(timezone(timedelta(hours=8))) 
        delta = timedelta(days=7)
        n_days = now + delta
        secret = "wdfm3lmlask3"
        if request.method == 'PUT':
            data = request.get_json()
            userMail = data['email']
            password = data['password']
            if userMail == '' or password == '':
                return {"error":True,"message":"欄位不得為空"},400
            if len(password) < 6:
                  return {"error":True,"message":"密碼長度至少6字元"},400
            sql = "SELECT id, name, email, password FROM member WHERE email = %s AND password = %s "
            val = [userMail,password]
            conn = db.connection.get_connection()
            cursor = conn.cursor(buffered=True, dictionary=True)
            cursor.execute(sql,val)
            cursor.close()
            conn.close()
            result = cursor.fetchone()
            #要把使用者資訊帶入 payload
            if result is None:
                return {"error":True,"message":"Email不存在"},400
            payload = {
            "id":result['id'],
            "iat":now,
            "exp":n_days,
            }
            encoded_jwt = jwt.encode(payload, secret, algorithm="HS256")
            resp = make_response({"ok":True})
            resp.set_cookie(key='token',value=encoded_jwt)
            # resp.headers['Set-Cookie'] = encoded_jwt
            return resp
        elif request.method == 'GET':
            #確認token尚未過期 取得cookie
            resp = request.cookies.get("token") 
            print(resp) 
            if resp is None:
                return {"data":None}
            decode_jwt = jwt.decode(resp, secret, algorithms=["HS256"])
            if decode_jwt:
                return {"data":decode_jwt}

        elif request.method == 'DELETE':
            #刪除cookie
            resp = make_response({"ok":True})
            resp.set_cookie(key='token', value='', expires=0)
            return resp
    except:
        return {"error": True, "message": "伺服器內部錯誤"}, 500


       
        #如果帳密是對的話 JWT SET cookie 
