from flask import *
from data.database import db
import requests
import os
from utils.validate import *
from datetime import datetime, timezone, timedelta

order = Blueprint("order", __name__)


@order.post("/api/orders")
def post_order():
    conn = db.connection.get_connection()
    cursor = conn.cursor(buffered=True, dictionary=True)
    order_number = ""
    pay_status = 1
    try:
        resp = request.cookies.get("token")
        data = request.get_json()
        if not resp:
            return {"error": True, "message": "請先登入會員"}, 403
        if not data["name"] or not data["mail"] or not data["phone"]:
            return {"error": True, "message": "請填寫所有資訊"}, 403
        jwt_result = Validation.decode_jwt(resp)
        t_zone = timezone(timedelta(hours=+8))
        now = datetime.now(t_zone)
        order_number = now.strftime("%Y%m%d%H%M%S")

        # 查詢booking是否已存在訂單編號
        for id in data["id"]:
            sql = "SELECT order_number FROM booking WHERE id = %s"
            val = [id]
            cursor.execute(sql, val)
        result = cursor.fetchone()
        if result["order_number"]:
            print(pay_status)
            return {"error": True, "message": "請確認是否重複付款"}
        prime = data["prime"]
        price = data["price"]
        name = data["name"]
        email = data["mail"]
        phone = data["phone"]
        sql = "INSERT INTO orders (order_number, name, email, phone, price, order_by, status) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        val = [order_number, name, email, phone, price, jwt_result["email"], False]
        cursor.execute(sql, val)
        conn.commit()

        # 串接付款金流 api網址
        api_url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        # HTTP request header
        headers = {
            "Content-Type": "application/json",
            "x-api-key": os.getenv("partner_key"),
        }
        # request body
        post_data = {
            "prime": prime,
            "amount": price,
            "merchant_id": os.getenv("merchant_id"),
            "partner_key": os.getenv("partner_key"),
            "details": name + "'s booking",
            "cardholder": {"name": name, "email": email, "phone_number": phone},
        }
        # 發送請求
        response = requests.post(api_url, json=post_data, headers=headers).json()
        pay_status = response["status"]
        print("response", response)
        if pay_status == 0:
            print(pay_status)
            for id in data["id"]:
                sql = "UPDATE booking SET order_number = %s WHERE id = %s"
                val = [order_number, id]
                cursor.execute(sql, val)
            conn.commit()
            sql = "UPDATE orders SET status = %s WHERE order_number = %s"
            val = [True, order_number]
            cursor.execute(sql, val)
            conn.commit()

            return {
                "data": {
                    "number": order_number,
                    "payment": {"status": pay_status, "message": "付款成功"},
                }
            }, 200
        else:
            return {
                "data": {
                    "error": True,
                    # "number": order_number,
                    "payment": {"status": pay_status, "message": "付款失敗"},
                }
            }, 400
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    finally:
        cursor.close()
        conn.close()


@order.get("/api/orders")
def get_history():
    conn = db.connection.get_connection()
    cursor = conn.cursor(buffered=True, dictionary=True)
    resp = request.cookies.get("token")
    result = Validation.decode_jwt(resp)
    try:
        if not resp:
            return {"error": True, "message": "請先登入會員"}, 403
        sql = """
        SELECT booking.order_number,orders.id, orders.name, orders.email, orders.phone, orders.price,
        GROUP_CONCAT( "id:" ,orders.id,",",
                    "attraction_id:" ,attraction_id,",",
                    "attraction_name:" ,attraction_name, ",",
                    "address:",address, ",",
                    "image:",image, ",",
                    "date:",DATE_FORMAT(date, '%Y-%m-%d'), ",",
                    "time:",`time`, ",",
                    "price:",booking.price,",",
                    "order_number:",booking.order_number, ",",
                    "user_email:",user_email
                    SEPARATOR ';' ) AS `grouping`
        FROM booking INNER JOIN orders ON orders.order_number = booking.order_number 
        WHERE user_email = %s GROUP BY orders.order_number,orders.id, orders.name,orders.email,orders.phone, orders.price
        ORDER BY orders.id DESC
        """
        val = [result["email"]]

        cursor.execute(sql, val)
        order_result = cursor.fetchall()
        for i in range(len(order_result)):
            grouping_list = order_result[i]["grouping"].split(";")
            nested_dicts = []
            for grouping in grouping_list:
                key_value_pairs = grouping.split(",")
                # print(key_value_pairs)
                nested_dict = {}
                for kv in key_value_pairs:
                    key, value = kv.rsplit(":", 1)
                    nested_dict[key] = value
                nested_dicts.append(nested_dict)

            # 經處理資料放回grouping
            order_result[i]["grouping"] = nested_dicts
        json_data = json.dumps(order_result)
        # Return the JSON object to the frontend
        return json_data

    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    finally:
        cursor.close()
        conn.close()


@order.get("/api/order/<order_number>")
def get_ordernumber():
    pass
