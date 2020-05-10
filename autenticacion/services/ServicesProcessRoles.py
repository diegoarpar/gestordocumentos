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

procesroles = Blueprint('userprocesroles', __name__)

collection="userprocessroles"
@procesroles.route('/authentication/processroles/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@procesroles.route('/authentication/processroles/',methods = ['PUT'])
def save():
    data = request.get_json()
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":"tenant agregado","flag":True}

@procesroles.route('/authentication/processroles/delete/',methods = ['POST'])
def delete():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

