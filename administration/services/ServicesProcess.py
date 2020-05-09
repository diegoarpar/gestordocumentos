from flask import Blueprint
from db import Db
from flask import request
import sys
sys.path.append('../')
from utils import Utils as utils

process = Blueprint('process', __name__)

collection="process"
@process.route('/administration/process/',methods = ['POST'])
def getRoles():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@process.route('/administration/process/',methods = ['PUT'])
def saveRoles():
    data = request.get_json()
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":"tenant agregado","flag":True}

@process.route('/administration/process/delete/',methods = ['POST'])
def deleteRoles():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

