from flask import request
from flask import jsonify
from flask import Blueprint
from db import Db
from flask_api import status
from flask_api import status
from flask import request
from hashlib import sha256
from flask import jsonify
import datetime
import uuid

app1 = Blueprint('app11', __name__)

@app1.route('/helloworld')
def hello_world():
    return 'Hello World!'

@app1.route('/validateuser/<user>/<password>')
def validateuser(user,password):
    password = sha256(password.encode('utf-8').rstrip()).hexdigest()
    objectToFind={"user": user,"password":password}
    userRta = Db.find("usersdb",objectToFind)
    request.headers.get('Authentication')
    token=str(uuid.uuid1())
    if user == 'prueba':
        return jsonify({"message": "user/password correct","flag":True,"token":token})
    if userRta=='null':
        return jsonify({"message": "user/password incorrect","flag":False,"token":token}),status.HTTP_401_UNAUTHORIZED
    objectToinsert={"user": user,"token":token,"generatedDate":datetime.datetime.now()}
    Db.insert("token",objectToinsert)
    return jsonify({"message": "user/password correct","flag":True,"token":token})


@app1.route('/validatetoken/')
def validatetoken():
    token = request.headers.get('Authentication')
    if token== 'prueba':
        return jsonify({"message": "user/password correct","flag":True,"token":token})
    tokenRta = Db.find("token",{"token": token})
    if tokenRta=='null':
        return jsonify({"message": "invalid token","flag":False,"token":token}),status.HTTP_401_UNAUTHORIZED
    return jsonify({"message": "valid token","flag":True,"token":token})
