from data.database import db

class Booking:
    def post(data,result):
        try:
            sql = 'INSERT INTO booking (attraction_id, attraction_name, address, image, date, time, price, user_email) VALUES (%s,%s ,%s ,%s, %s, %s, %s, %s)'
            val = [data['attractionId'],data['name'],data['address'],data['image'],data['date'],data['time'],data['price'],result['email']]
            conn = db.connection.get_connection()
            cursor = conn.cursor(buffered=True, dictionary=True)
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
        try:
            sql = 'SELECT booking.id, attraction_id, attraction_name, address, image, date, time, price, name, email FROM booking INNER JOIN member ON %s = member.email;'
            val = [result['email']]
            #array 
            conn = db.connection.get_connection()
            cursor = conn.cursor(buffered=True, dictionary=True)
            cursor.execute(sql,val)
            result = cursor.fetchall() 
            if not result:
                return None
            return result
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()
    def delete(data):
        try:
            sql = "DELETE FROM booking WHERE id = %s"
            val = [data['id']]
            conn = db.connection.get_connection()
            cursor = conn.cursor(buffered=True, dictionary=True)
            cursor.execute(sql,val)
            conn.commit()
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()
