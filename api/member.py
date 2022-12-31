# import jwt
import boto3
from flask import *
from flask_bcrypt import Bcrypt
from utils.validate import *
from model.member import *
import os
import base64
import botocore

# from PIL import Image

member = Blueprint("user", __name__)
bcrypt = Bcrypt()

client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("access_key"),
    aws_secret_access_key=os.getenv("secret_access_key"),
)


# 註冊
@member.post("/api/user")
def user():
    try:
        data = request.get_json()
        name = data["name"]
        email = data["email"]
        password = data["password"]
        result = Member.check_signup(data)
        if name == "" or email == "" or password == "":
            return {"error": True, "message": "欄位不得為空"}, 400
        elif not result:
            return {"error": True, "message": "信箱已被註冊"}, 400
        elif len(password) < 6:
            return {"error": True, "message": "密碼長度至少6字元"}, 400
        elif not check(email):
            return {"error": True, "message": "email格式不正確"}, 400
        hashed_password = bcrypt.generate_password_hash(password=password)
        Member.signup(data, hashed_password)
        return {"ok": True, "message": "您已註冊成功✅，請登入"}
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500


# get user
@member.get("/api/user/auth")
def login_get():
    try:
        resp = request.cookies.get("token")
        if resp is None:
            return {"data": None}
        result = Validation.decode_jwt(resp)
        return {"data": result}
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500


# 登入
@member.put("/api/user/auth")
def login_put():
    try:
        data = request.get_json()
        email = data["email"]
        password = data["password"]
        if email == "" or password == "":
            return {"error": True, "message": "欄位不得為空"}, 400
        elif len(password) < 6:
            return {"error": True, "message": "密碼長度至少6字元"}, 400
        elif not check(email):
            return {"error": True, "message": "email格式不正確"}, 400
        result = Member.signin_put(data)
        if not result:
            return {"error": True, "message": "Email不存在"}, 400
        # hash後的密碼
        hashed_password = result["password"]
        # 和輸入的密碼做比對
        check_password = bcrypt.check_password_hash(hashed_password, password)
        if not check_password:
            return {"error": True, "message": "密碼錯誤"}, 400
        resp = Validation.encode_jwt(result["id"], result["name"], result["email"])
        return resp
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500


@member.patch("/api/user/auth")
def user_patch():
    try:
        jwt_data = request.cookies.get("token")
        result = Validation.decode_jwt(jwt_data)
        data = request.get_json()
        # print(data)
        if data["name"] == "":
            return {"error": True, "message": "欄位不得為空"}, 400
        Member.update_name(jwt_data, result, data)
        return {"data": True}
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500


@member.delete("/api/user/auth")
def user_delete():
    try:
        resp = Validation.delete_jwt()
        return resp
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500


@member.post("/api/user/image")
def user_image():
    resp = request.cookies.get("token")
    if resp is None:
        return {"data": None}
    result = Validation.decode_jwt(resp)
    file = request.files["files"]
    parts = file.filename.split(".")
    parts[0] = str(result["id"])
    parts[1] = "jpg"
    file.filename = ".".join(parts)
    client.upload_fileobj(file, "tpdaytripbucket", file.filename)
    # ACL='public-read'
    return {"ok": True}


@member.get("/api/user/image")
def get_image():
    try:
        resp = request.cookies.get("token")
        if resp is None:
            return {"data": None}
        result = Validation.decode_jwt(resp)
        filename = str(result["id"]) + ".jpg"
        s3_object = client.get_object(Bucket="tpdaytripbucket", Key=filename)
        data = s3_object["Body"].read()
        base64_data = base64.b64encode(data).decode()
        base64_data = "data:image/jpeg;base64," + base64_data
        return {"ok": True, "data": base64_data}
    except botocore.exceptions.ClientError as e:
        return {"error": True, "message": "尚無照片"}, 400
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500
