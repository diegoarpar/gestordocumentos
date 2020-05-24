from flask import Blueprint
from db import Db
from flask import request
import sys
sys.path.append('../')
from utils import Utils as utils

sedelectronica_generalconf = Blueprint('sedelectronica_generalconf', __name__)

collection="sedelectronica_generalconf"
@sedelectronica_generalconf.route('/administration/sedeelectronica/general/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@sedelectronica_generalconf.route('/administration/sedeelectronica/general/',methods = ['PUT'])
def save():
    data = request.get_json()
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":" agregado","flag":True}

@sedelectronica_generalconf.route('/administration/sedeelectronica/general/modify/',methods = ['PUT'])
def update():
    data = request.get_json()
    userQuery=data["query"]
    userNewData=data["new"]
    rta = Db.update(collection,userQuery,userNewData,utils.getTenant(request))
    return {"messaage":"modificado","flag":True}



@sedelectronica_generalconf.route('/administration/sedeelectronica/general/delete/',methods = ['POST'])
def delete():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

