from flask import Blueprint
from db import Db
from flask import request
import sys
sys.path.append('../')
from utils import Utils as utils

process_activity = Blueprint('process_activity', __name__)

collection="process_activity"
@process_activity.route('/administration/process/activity/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@process_activity.route('/administration/process/activity/',methods = ['PUT'])
def save():
    data = request.get_json()
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":" agregado","flag":True}

@process_activity.route('/administration/process/activity/modify/',methods = ['PUT'])
def update():
    data = request.get_json()
    userQuery=data["query"]
    userNewData=data["new"]
    rta = Db.update(collection,userQuery,userNewData,utils.getTenant(request))
    return {"messaage":"modificado","flag":True}



@process_activity.route('/administration/process/activity/delete/',methods = ['POST'])
def delete():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

