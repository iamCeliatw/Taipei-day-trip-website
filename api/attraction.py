from flask import *
from flask_bcrypt import Bcrypt         
from model.attraction import *
#blueprint setup
attract = Blueprint('attraction',__name__) 
bcrypt = Bcrypt()

@attract.route('/api/categories')
def cat():
    try:
        result = Attraction.get_cat()
        catList = []
        for i in result:
            catList.append(i['cat'])
        return {'data':catList}
    except Exception as e:
        print(e) 
        return {'error': True,'message':"伺服器內部錯誤"},500

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
            result = Attraction.get_allSpot(perpage,offset)
            if len(result) < 13:
                return {'nextPage': None, 'data':result}
            result = result[:-1]
            return {'nextPage': page+1, 'data':result}

        else:
            perpage = 13
            offset = page * (perpage-1)
            result = Attraction.get_keywordSpot(page,keyword,perpage)
            if result is None:
                return {'nextPage': None,'data':result}
            if len(result) < 13:
                return {'nextPage': None,'data':result}
            result = result[:-1]
            return {'nextPage': page+1,'data':result}
    except:
        return {'error': True, 'message': "伺服器內部錯誤"}, 500


@attract.route("/api/attraction/<id>")
def attraction(id):
    try:
        all_result = Attraction.get_spot(id)
        if all_result:
            return {'data': all_result}
        else:
            return {"error": True, "message": "景點編號不正確"}, 400
    except Exception as e:
        print(e) 
        return {"error": True, "message": "伺服器內部錯誤"}, 500