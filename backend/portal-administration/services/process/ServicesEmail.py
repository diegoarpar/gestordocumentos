from flask import Blueprint
from db import Db
from flask import request
from threads import SendEmail

import sys
sys.path.append('../')
from utils import Utils as utils

email = Blueprint('email', __name__)

collection="email"
@email.route('/administration/email/',methods = ['POST'])
def get():
    data = request.get_json()
    rta = Db.findMultiple(collection,data,utils.getTenant(request))
    return rta

@email.route('/administration/email/',methods = ['PUT'])
def save():
    data = request.get_json()
    SendEmail.initThread(utils.getTenant(request))
    rta = Db.insert(collection,data,utils.getTenant(request))
    return {"messaage":" agregado","flag":True}

@email.route('/administration/email/update/',methods = ['PUT'])
def update():
    data = request.get_json()
    userQuery=data["query"]
    userNewData=data["new"]
    rta = Db.update(collection,userQuery,userNewData,utils.getTenant(request))
    return {"messaage":"modificado","flag":True}



@email.route('/administration/email/delete/',methods = ['POST'])
def delete():
    data = request.get_json()
    rta = Db.remove(collection,data,utils.getTenant(request))
    return rta

