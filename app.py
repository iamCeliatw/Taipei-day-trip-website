import json

import mysql.connector
from flask import *
from flask_mysqlpool import MySQLPool


app=Flask(__name__,
    static_folder="static/",
    static_url_path="/"
)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASS'] = 'asd24680'
app.config['MYSQL_DB'] = 'data'
app.config['MYSQL_POOL_NAME'] = 'mysql_pool'
app.config['MYSQL_POOL_SIZE'] = 5
app.config['MYSQL_AUTOCOMMIT'] = True

db = MySQLPool(app)

@app.route('/api/attractions')
def attraction_spot():
    try:
        args = request.args
        page = args.get("page", type=int, default=0)
        keyword = args.get("keyword", default=None)
        if keyword is None:
            perpage = 12
            offset = page * perpage
            conn = db.connection.get_connection()
            sql = "SELECT id,name,cat,description,direction,mrt,address,latitude,longitude, image FROM `spots` LIMIT %s OFFSET %s"
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
            if len(result) < 12:
                return jsonify({'nextPage': None, 'data':result})
            return jsonify({'nextPage': page+1, 'data':result})
        elif keyword:
            perpage = 12
            offset = page * perpage
            # print(startAt)
            conn = db.connection.get_connection()
            sql = "SELECT id,name,cat,description,direction,mrt,address,latitude,longitude, image FROM `spots` WHERE `cat` = %s or name LIKE %s LIMIT %s OFFSET %s"
            val = [keyword, "%"+f"{keyword}"+"%", perpage, offset]
            cursor = conn.cursor(dictionary=True)
            cursor.execute(sql, val)
            result = cursor.fetchall()
            # print("result:" , len(result))
            imgs = []
            for i in result:
                img = i['image'].split('https://')
                for j in range(len(img)):
                    img[j] = 'https://' + img[j]
                img.pop(0)
                imgs.append(img)
            print(imgs)
            cursor.close()
            conn.close()
            # print(result)
            for i in range(len(result)):
                result[i]['image'] = imgs[i]
            if len(result) < 12:
                return jsonify({'nextPage': None,'data':result})
            return jsonify({'nextPage': page+1,'data':result})
    except:
        return jsonify({'error': True, 'message': "伺服器內部錯誤"}), 500

@app.route('/api/categories')
def cat():
    try:
        conn = db.connection.get_connection()
        #取值不重複 
        sql = "SELECT DISTINCT `cat` FROM `spots` "
        cursor = conn.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        # print(type(result[0]))
        # print(result[0])
        catList = []
        for i in result:
            # list(result)
            # print(type(i[0]))
            catList.append(i[0])
        print(catList)
        cursor.close()
        conn.close()
        return jsonify({'data': catList})
    except:
        return jsonify({'error': True,'message':"伺服器內部錯誤"}),500



# Pages
@app.route("/")
def index():
	return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    try:
        conn = db.connection.get_connection()
        sql1 = 'SELECT image FROM `spots` WHERE `id` = %s'
        val1 = [id]
        cursor = conn.cursor()
        cursor.execute(sql1, val1)
        result = cursor.fetchone()
        print(result)
        if result is not None:
            str = ''.join(result)
            # print(str)
            img = str.split('https://')
            # print(img)
            img.pop(0)
            arrImg = []
            for i in img:
                arrImg.append('https://' + i)
            # print(arrImg)
            sql2 = "SELECT id , name, cat, description, direction, mrt, address, latitude, longitude FROM `spots` WHERE `id` = %s "
            val2 = [id]
            cursor = conn.cursor(dictionary=True)
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
    # json_data = json.loads(json_result)
	# return render_template("attraction.html")


@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


app.run(host='0.0.0.0', port=3000, debug=True)