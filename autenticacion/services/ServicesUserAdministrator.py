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

app3 = Blueprint('app3', __name__)

@app3.route('/authentication/users/',methods = ['GET'])
def validateUser():
    data = request.get_json()
    objectToFind={}
    userRta = Db.findMultiple("usersdb",objectToFind)
    return userRta


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
