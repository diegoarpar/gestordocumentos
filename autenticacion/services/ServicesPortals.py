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

app6 = Blueprint('app6', __name__)

@app6.route('/authentication/portals/',methods = ['POST'])
def getRoles():
    data = request.get_json()
    rta = Db.findMultiple(utils.getTenant(request)+"_userportals",data)
    return rta

@app6.route('/authentication/portals/',methods = ['PUT'])
def saveRoles():
    data = request.get_json()
    rta = Db.insert(utils.getTenant(request)+"_userportals",data)
    return {"messaage":"tenant agregado","flag":True}

@app6.route('/authentication/portals/delete/',methods = ['POST'])
def deleteRoles():
    data = request.get_json()
    rta = Db.remove(utils.getTenant(request)+"_userportals",data)
    return rta

