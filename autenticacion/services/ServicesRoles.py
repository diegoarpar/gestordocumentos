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

app4 = Blueprint('app4', __name__)

collection="userroles"
@app4.route('/authentication/roles/',methods = ['POST'])
def getRoles():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@app4.route('/authentication/roles/',methods = ['PUT'])
def saveRoles():
    data = request.get_json()
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":"tenant agregado","flag":True}

@app4.route('/authentication/roles/delete/',methods = ['POST'])
def deleteRoles():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

