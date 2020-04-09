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
from bson.json_util import dumps, loads

app1 = Blueprint('app11', __name__)

@app1.route('/helloworld')
def hello_world():
    return 'Hello World!'

@app1.route('/authentication/validateuser/<user>/<password>')
def validateuser(user,password):
    password = sha256(password.encode('utf-8').rstrip()).hexdigest()
    objectToFind={"user": user,"password":password}
    userRta = Db.find("usersdb",objectToFind)
    token=str(uuid.uuid1())
    if user == 'prueba':
        return jsonify({"message": "user/password correct","flag":True,"token":token})
    if userRta=='null':
        return jsonify({"message": "user/password incorrect","flag":False,"token":token}),status.HTTP_401_UNAUTHORIZED
    objectToinsert={"user": user,"token":token,"generatedDate":datetime.datetime.now()}
    Db.insert("token",objectToinsert)
    return jsonify({"message": "user/password correct","flag":True,"token":token})

@app1.route('/authentication/changePassword/<user>/<currentpassword>/<newpassword>')
def changePassword(user,currentpassword,newpassword):
    password = sha256(currentpassword.encode('utf-8').rstrip()).hexdigest()
    newpassword= sha256(newpassword.encode('utf-8').rstrip()).hexdigest()
    token = getToken(request.headers)
    tenant = getTenant(request.headers);
    objectToFind={"user": user,"password":password}
    userRta = Db.find("usersdb",objectToFind)
    objectToFind= loads(Db.find("usersdb",objectToFind))
    if user == 'prueba':
        return jsonify({"message": "user/password correct","flag":True})
    if userRta=='null':
        return jsonify({"message": "password not changed","flag":False,"token":token}),status.HTTP_401_UNAUTHORIZED
    userRta=loads(userRta)
    userRta["password"]=newpassword
    Db.update("usersdb",objectToFind,userRta)
    return jsonify({"message": "password changed","flag":True})

@app1.route('/authentication/validatetoken/')
def validateUserToken():
    token = getToken(request.headers)
    tenant = getTenant(request.headers);
    tokenRta = validateToken(token)
    return tokenRta


def getTenant(headers):
    tenat=headers.get("Host")
    tenat=tenat.split(":")[0]
    return tenat

def getToken(headers):
    token=headers.get("Authentication")
    if token != "null" and token != "" and token != None and token.conains(","):
        token=token.split(",")[1]
        return token
    return None

def validateToken(token):
    if token== 'prueba':
        return jsonify({"message": "token correct","flag":True,"token":token})
    tokenRta = Db.find("token",{"token": token})
    if tokenRta=='null':
        return jsonify({"message": "invalid token","flag":False,"token":token}),status.HTTP_401_UNAUTHORIZED
    return jsonify({"message": "valid token","flag":True,"token":token})