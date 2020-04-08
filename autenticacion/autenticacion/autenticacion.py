from flask import Flask
from flask_pymongo import PyMongo
import configparser
from flask_cors import CORS

app = Flask(__name__)




@app.route('/helloworld')
def hello_world():
    return 'Hello World!'

@app.route('/hellomongo')
def hello_mongo():

    online_users = mongo.db.users.find({"mongoadmin": True})
    return 'Conectado a mongo'

@app.route('/authentication/<user>/<password>')
def authentication(user,password):
    mongo.db.usersdb.find_one_or_404({"user": user})
    return user+password


if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read('../config/configAutentication.ini')
    app.config["MONGO_URI"] =config['mongoApp']['Uri']+config['mongoApp']['Database']
    app.config["MONGO_URI"]="mongodb://mongoadmin:secret@192.168.0.16:27018/admin"
    mongo = PyMongo(app)
    #cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    cors = CORS(app, resources={"*": {"origins": "*"}})

    app.run()