# import jwt
from flask import *

from data.database import db

# from model.validate import *
class Member:
    def check_signup(data):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            email = data["email"]
            sql = "SELECT * FROM member WHERE email = %s"
            val = [email]
            cursor.execute(sql, val)
            result = cursor.fetchone()
            if not result:
                return True
            return False
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def signup(data, hashed_password):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            name = data["name"]
            email = data["email"]
            sql = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
            val = [name, email, hashed_password]
            cursor.execute(sql, val)
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def signin_put(data):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            data = request.get_json()
            email = data["email"]
            password = data["password"]
            sql = "SELECT id, name, email, password FROM member WHERE email = %s "
            val = [email]
            cursor.execute(sql, val)
            result = cursor.fetchone()
            if not result:
                return False
            return result
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def update_name(jwt_data, result, data):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            sql = "UPDATE member SET name = %s WHERE email = %s"
            val = [data["name"], result["email"]]
            cursor.execute(sql, val)
            conn.commit()
            return True
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()
