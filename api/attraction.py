from flask import *
from flask_bcrypt import Bcrypt

# from api.database import db           
from model.attraction import *
#blueprint setup
attract = Blueprint('attraction',__name__) 
bcrypt = Bcrypt()

@attract.route('/api/categories')
def cat():
    try:
        sql = "SELECT DISTINCT `cat` FROM `spots` "
        result = Sql.fetch_all(sql)
        catList = []
        for i in result:
            catList.append(i['cat'])
        return jsonify({'data':catList})
    except Exception as e:
        print(e) 
        return jsonify({'error': True,'message':"伺服器內部錯誤"}),500

@attract.route('/api/attractions')
def attraction_spot():
    try:
        args = request.args
        page = args.get("page", type=int, default=0)
        keyword = args.get("keyword", default='')
        if keyword == '':
            perpage = 13
            # 第一頁 取 0~13 第二頁 取 第13~25（13筆）
            offset = page * (perpage-1)

            sql = "SELECT sid,id,name,cat,description,direction,mrt,address,latitude,longitude, image \
            FROM `spots` LIMIT %s OFFSET %s"
            val = [perpage, offset]
            result = Sql.fetch_all(sql,val)
            imgs = []
            for i in result:
                img = i['image'].split('https://')
                for j in range(len(img)):
                    img[j] = 'https://' + img[j]
                img.pop(0)
                imgs.append(img)
            for i in range(len(result)):
                result[i]['image'] = imgs[i]
            if len(result) < 13:
                return jsonify({'nextPage': None, 'data':result})
            result = result[:-1]
            return jsonify({'nextPage': page+1, 'data':result})

        else:
            perpage = 13
            offset = page * (perpage-1)
            sql = "SELECT sid,id,name,cat,description,direction,mrt,address,latitude,longitude, image \
                   FROM `spots` WHERE `cat` = %s or name LIKE %s LIMIT %s OFFSET %s"
            val = [keyword, "%"+f"{keyword}"+"%", perpage, offset]
            result = Sql.fetch_all(sql,val)
            print(result)
            imgs = []
            if result is None:
                return jsonify({'nextPage': None,'data':result})
            for i in result:
                img = i['image'].split('https://')
                for j in range(len(img)):
                    img[j] = 'https://' + img[j]
                img.pop(0)
                imgs.append(img)
            for i in range(len(result)):
                result[i]['image'] = imgs[i]
            if len(result) < 13:
                return jsonify({'nextPage': None,'data':result})
            result = result[:-1]
            return jsonify({'nextPage': page+1,'data':result})
    except:
        return jsonify({'error': True, 'message': "伺服器內部錯誤"}), 500


@attract.route("/api/attraction/<id>")
def attraction(id):
    try:
        # conn = db.connection.get_connection()
        sql = 'SELECT image FROM `spots` WHERE `id` = %s'
        val = [id]
        result = Sql.fetch_one(sql,val)
        if result:
            img = result['image'].split('https://')
            img.pop(0)
            arrImg = []
            for i in img:
                arrImg.append('https://' + i)
            sql = "SELECT sid, id , name, cat, description, direction, mrt, address, latitude, longitude \
                    FROM `spots` WHERE `id` = %s "
            val = [id]
            all_result = Sql.fetch_one(sql,val)
            # 新增照片網址的陣列
            all_result.setdefault('image', arrImg)
            return jsonify({'data': all_result})
        else:
            return jsonify({"error": True, "message": "景點編號不正確"}), 400
    except Exception as e:
        print(e) 
        return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500