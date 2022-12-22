import os

from flask import *

from api.attraction import attract
from api.member import member
from api.booking import booking
from api.order import order
from data.database import db

# from flask_cors import CORS


app = Flask(__name__,
    template_folder='templates',
    static_folder="static/",
    static_url_path="/"
)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_PORT'] = 3306
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASS'] = os.getenv("db_password")
app.config['MYSQL_DB'] = 'data'
app.config['MYSQL_POOL_NAME'] = 'mysql_pool'
app.config['MYSQL_POOL_SIZE'] = 5
app.config['MYSQL_AUTOCOMMIT'] = True

db.init_app(app)

#Blueprint register
app.register_blueprint(attract)
app.register_blueprint(member)
app.register_blueprint(booking)
app.register_blueprint(order)
# CORS(app, resources=r"/*")
# cors = CORS(app, resources={r"/cities/*": {"origins": "*"}})


# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=3000, debug=True)