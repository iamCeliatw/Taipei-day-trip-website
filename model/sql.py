
from data.database import db

class Sql:
    def fetch_one(sql,val):
        try:
            conn = db.connection.get_connection()
            cursor = conn.cursor(buffered=True, dictionary=True)
            cursor.execute(sql,val)
            result = cursor.fetchone()
            return result
        except Exception as e: 
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def execute(sql,val):
        try:
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


    def fetch_all(sql,val=''):
        try:
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

