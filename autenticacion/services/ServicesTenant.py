from flask import Blueprint
from db import Db
from flask import request
import sys
sys.path.append('../')

app5 = Blueprint('app5', __name__)
collection = "tenant"
@app5.route('/authentication/tenant/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.find(collection,data,"")
    return rta

@app5.route('/authentication/tenant/',methods = ['PUT'])
def save():
    data = request.get_json()
    rta = Db.insert(collection,data,"")
    return {"messaage":"tenant agregado","flag":True}

@app5.route('/authentication/tenant/',methods = ['DELETE'])
def delete():
    data = request.get_json()
    rta = Db.remove(collection,data,"")
    return rta