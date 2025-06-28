from flask import Blueprint
from db import Db
from flask import request
import sys
sys.path.append('../')
from utils import Utils as utils

form_config = Blueprint('form_config', __name__)

collection="form_config"
@form_config.route('/administration/process/form/config/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@form_config.route('/administration/process/form/config/',methods = ['PUT'])
def save():
    data = request.get_json()
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":" agregado","flag":True}

@form_config.route('/administration/process/form/config/modify/',methods = ['PUT'])
def update():
    data = request.get_json()
    userQuery=data["query"]
    userNewData=data["new"]
    rta = Db.update(collection,userQuery,userNewData,utils.getTenant(request))
    return {"messaage":"modificado","flag":True}



@form_config.route('/administration/process/form/config/delete/',methods = ['POST'])
def delete():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

