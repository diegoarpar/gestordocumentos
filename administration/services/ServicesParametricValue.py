from flask import Blueprint
from db import Db
from flask import request
import sys
sys.path.append('../')
from utils import Utils as utils

parametricvalue = Blueprint('parametricvalue', __name__)

collection="parametricvalue"
@parametricvalue.route('/administration/parametricvalue/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@parametricvalue.route('/administration/parametricvalue/',methods = ['PUT'])
def save():
    data = request.get_json()
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":" agregado","flag":True}

@parametricvalue.route('/administration/parametricvalue/modify/',methods = ['PUT'])
def update():
    data = request.get_json()
    userQuery=data["query"]
    userNewData=data["new"]
    rta = Db.update(collection,userQuery,userNewData,utils.getTenant(request))
    return {"messaage":"modificado","flag":True}



@parametricvalue.route('/administration/parametricvalue/delete/',methods = ['POST'])
def delete():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

