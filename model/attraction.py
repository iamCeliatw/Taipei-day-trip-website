from data.database import db


class Attraction:
    def get_cat():
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            sql = "SELECT DISTINCT `cat` FROM `spots` "
            cursor.execute(sql)
            result = cursor.fetchall()
            return result
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def get_allSpot(perpage, offset):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            sql = "SELECT sid,id,name,cat,description,direction,mrt,address,latitude,longitude, image \
            FROM `spots` LIMIT %s OFFSET %s"
            val = [perpage, offset]
            cursor.execute(sql, val)
            result = cursor.fetchall()
            imgs = []
            for i in result:
                img = i["image"].split("https://")
                for j in range(len(img)):
                    img[j] = "https://" + img[j]
                img.pop(0)
                imgs.append(img)
            for i in range(len(result)):
                result[i]["image"] = imgs[i]
            return result
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def get_keywordSpot(page, keyword, perpage):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            # perpage = 13
            offset = page * (perpage - 1)
            sql = "SELECT sid,id,name,cat,description,direction,mrt,address,latitude,longitude, image \
                   FROM `spots` WHERE `cat` = %s or name LIKE %s LIMIT %s OFFSET %s"
            val = [keyword, "%" + f"{keyword}" + "%", perpage, offset]
            cursor.execute(sql, val)
            result = cursor.fetchall()
            imgs = []
            if result is None:
                return None
            for i in result:
                img = i["image"].split("https://")
                for j in range(len(img)):
                    img[j] = "https://" + img[j]
                img.pop(0)
                imgs.append(img)
            for i in range(len(result)):
                result[i]["image"] = imgs[i]
            if not result:
                return None
            return result
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()

    def get_spot(id):
        conn = db.connection.get_connection()
        cursor = conn.cursor(buffered=True, dictionary=True)
        try:
            sql = "SELECT image FROM `spots` WHERE `id` = %s"
            val = [id]
            cursor.execute(sql, val)
            result = cursor.fetchone()
            if result:
                img = result["image"].split("https://")
                img.pop(0)
                arrImg = []
                for i in img:
                    arrImg.append("https://" + i)
                sql = "SELECT sid, id , name, cat, description, direction, mrt, address, latitude, longitude \
                    FROM `spots` WHERE `id` = %s "
                val = [id]
                cursor = conn.cursor(buffered=True, dictionary=True)
                cursor.execute(sql, val)
                all_result = cursor.fetchone()
                # 新增照片網址的陣列
                all_result.setdefault("image", arrImg)
                return all_result
        except Exception as e:
            print(e)
            return False
        finally:
            cursor.close()
            conn.close()
