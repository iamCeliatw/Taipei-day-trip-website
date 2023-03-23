from data.database import db
from collections import Counter


class Booking:
    def post(data, result):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            sql = "INSERT INTO booking (attraction_id, attraction_name, address, image, date, time, price, user_email) VALUES (%s,%s ,%s ,%s, %s, %s, %s, %s)"
            val = [
                data["attractionId"],
                data["name"],
                data["address"],
                data["image"],
                data["date"],
                data["time"],
                data["price"],
                result["email"],
            ]
            cursor.execute(sql, val)
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def get(result):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            sql = "SELECT booking.id, attraction_id, attraction_name, address, image, DATE_FORMAT(date, %s) AS date, time, price, name,\
            email FROM member INNER JOIN booking ON member.email = booking.user_email WHERE member.email = %s AND order_number IS NULL  "
            val = ["%Y-%m-%d", result["email"]]
            cursor.execute(sql, val)
            book_result = cursor.fetchall()
            dates = [i["date"] for i in book_result]
            counts = Counter(dates)
            arr = []
            if not book_result:
                return None
            for date in counts:
                if counts[date] > 1:
                    arr.append(date)
            return book_result, arr
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def delete(data, result):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            sql = "DELETE FROM booking WHERE id = %s and user_email = %s"
            val = [data["id"], result["email"]]
            cursor.execute(sql, val)
            conn.commit()
            if cursor.rowcount == 1:
                return True
        except Exception as e:
            print("e", e)
            return False
        finally:
            cursor.close()
            conn.close()
