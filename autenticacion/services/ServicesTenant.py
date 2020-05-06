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

app5 = Blueprint('app5', __name__)

@app5.route('/authentication/tenant/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.find("tenant",data)
    return rta

@app5.route('/authentication/tenant/',methods = ['PUT'])
def save():
    data = request.get_json()
    rta = Db.insert("tenant",data)
    return {"messaage":"tenant agregado","flag":True}

@app5.route('/authentication/tenant/',methods = ['DELETE'])
def delete():
    data = request.get_json()
    rta = Db.remove("tenant",data)
    return rta