import re
import os

from datetime import datetime, timedelta, timezone

import jwt
from flask import *

regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
secret = os.getenv("secret")
date1 = datetime.utcnow().replace(tzinfo=timezone.utc)
now = date1.astimezone(timezone(timedelta(hours=8)))
delta = timedelta(days=7)
n_days = now + delta


def check(email):
    if re.fullmatch(regex, email):
        return True
    return False


class Validation:
    def encode_jwt(id, name, email):
        try:
            payload = {
                "id": id,
                "name": name,
                "email": email,
                "iat": now,
                "exp": n_days,
            }
            encoded_jwt = jwt.encode(payload, secret, algorithm="HS256")
            resp = make_response({"ok": True})
            resp.set_cookie(key="token", value=encoded_jwt)
            return resp
        except Exception as e:
            print(e)
            return False

    def decode_jwt(resp):
        try:
            resp = jwt.decode(resp, secret, algorithms=["HS256"])
            # print(resp)
            if resp:
                return resp
            return False
        except Exception as e:
            print(e)
            return False

    def delete_jwt():
        try:
            resp = make_response({"ok": True})
            resp.set_cookie(key="token", value="", expires=0)
            return resp
        except Exception as e:
            print(e)
            return False
