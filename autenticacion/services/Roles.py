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

app4 = Blueprint('app4', __name__)

@app4.route('/helloworld')
def hello_world():
    return 'Hello World!'


@app4.route('/authentication/roles/',methods = ['POST'])
def getRoles():
    data = request.get_json()
    rta = Db.findMultiple("userroles",data)
    return data

@app4.route('/authentication/roles/',methods = ['PUT'])
def saveRoles():
    data = request.get_json()
    rta = Db.findMultiple("userroles",data)
    return rta

@app4.route('/authentication/roles/',methods = ['DELETE'])
def deleteRoles():
    data = request.get_json()
    rta = Db.remove("userroles",data)
    return rta