from flask import Blueprint
from db import Db
from flask import request
import sys
sys.path.append('../')
from utils import Utils as utils

processform = Blueprint('processform', __name__)

collection="process_form"
@processform.route('/administration/process/form/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@processform.route('/administration/process/form/',methods = ['PUT'])
def save():
    data = request.get_json()
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":" agregado","flag":True}

@processform.route('/administration/process/form/modify/',methods = ['PUT'])
def update():
    data = request.get_json()
    userQuery=data["query"]
    userNewData=data["new"]
    rta = Db.update(collection,userQuery,userNewData,utils.getTenant(request))
    return {"messaage":"modificado","flag":True}



@processform.route('/administration/process/form/delete/',methods = ['POST'])
def delete():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

