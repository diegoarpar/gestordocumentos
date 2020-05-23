from flask import Blueprint
from db import Db
from flask_api import status
from flask import request
from flask import jsonify
from bson.json_util import dumps, loads
import sys
sys.path.append('../')
from utils import Utils as utils

app1 = Blueprint('app11', __name__)

collection = "usersdb"

@app1.route('/authentication/changePassword/',methods = ['POST'])
def changePassword():
    data = request.get_json()
    currentpassword=data["currentpassword"]
    newpassword=data["newpassword"]
    user=data["user"]
    objectToFind={"user": user,"password":currentpassword}
    userRta = Db.find(collection,objectToFind,utils.getTenant(request))
    if userRta=='null':
        return jsonify({"message": "password not changed","flag":False}),status.HTTP_401_UNAUTHORIZED
    userRta=loads(userRta)
    userRta["password"]=newpassword
    Db.update(collection,objectToFind,userRta,utils.getTenant(request))
    return jsonify({"message": "password changed","flag":True})

@app1.route('/authentication/createuser/',methods = ['POST'])
def createUser():
    data = request.get_json()
    user=data["user"]
    objectToFind={"user": user}
    userRta = Db.find(collection,objectToFind,utils.getTenant(request))
    if userRta=="null":
        Db.insert(collection,data,utils.getTenant(request))
        return jsonify({"message": "user created","flag":True})
    return jsonify({"message": "user not created ","flag":True})

@app1.route('/authentication/users/',methods = ['GET'])
def getUsers():
    data = request.get_json()
    objectToFind={}
    userRta = Db.findMultiple(collection,objectToFind,utils.getTenant(request))
    return userRta

@app1.route('/authentication/users/',methods = ['POST'])
def getUserPost():
    data = request.get_json()
    userRta = Db.findMultiple(collection,data,utils.getTenant(request))
    return userRta

@app1.route('/authentication/updateUser/',methods = ['POST'])
def updateUser():
    data = request.get_json()
    userQuery=data["userQuery"]
    userNewData=data["userNewData"]

    userRta = Db.find(collection,userQuery,utils.getTenant(request))
    if userRta!="null":
        Db.update("usersdb",userQuery,userNewData,utils.getTenant(request))
        return jsonify({"message": "user created","flag":True})
    return jsonify({"message": "user not created ","flag":True})