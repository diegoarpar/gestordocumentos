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
import configparser
import requests
import sys
sys.path.append('../')
from utils import Utils as utils
app3 = Blueprint('app3', __name__)

@app3.route('/authentication/users/',methods = ['GET'])
def getUsers():
    data = request.get_json()
    objectToFind={}
    userRta = Db.findMultiple(utils.getTenant(request)+"_usersdb",objectToFind)
    return userRta

@app3.route('/authentication/updateUser/',methods = ['POST'])
def updateUser():
    data = request.get_json()
    userQuery=data["userQuery"]
    userNewData=data["userNewData"]

    userRta = Db.find(utils.getTenant(request)+"_usersdb",userQuery)
    if userRta!="null":
        Db.update(utils.getTenant(request)+"_usersdb",userQuery,userNewData)
        return jsonify({"message": "user created","flag":True})
    return jsonify({"message": "user not created ","flag":True})
