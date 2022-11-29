from flask import *

from database import db

#blueprint setup
api = Blueprint('api',__name__, url_prefix='/api')
 
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
        print(catList)
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
        if keyword is '':
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
        print(result)
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
            print(type(all_result))
            # 新增照片網址的陣列
            all_result.setdefault('image', arrImg)
            print(all_result)
            cursor.close()
            conn.close()
            return jsonify({'data': all_result})
        else:
            return jsonify({"error": True, "message": "景點編號不正確"}), 400
    except:
            return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500


