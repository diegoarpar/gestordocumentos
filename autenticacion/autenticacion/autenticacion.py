from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://192.168.0.16:17071/admin"
mongo = PyMongo(app)


@app.route('/helloworld')
def hello_world():
    return 'Hello World!'

@app.route('/hellomongo')
def hello_mongo():
    online_users = mongo.db.users.find({"mongoadmin": True})
    return 'Conectado a mongo'

if __name__ == '__main__':
    app.run()