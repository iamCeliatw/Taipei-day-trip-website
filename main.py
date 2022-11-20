import os

from flask import *

import setting
from api import api
from database import db

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
app.register_blueprint(api)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=3000, debug=True)