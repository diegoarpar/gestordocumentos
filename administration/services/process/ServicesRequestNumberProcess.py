from flask import Blueprint
from db import Db
from flask import request
import sys
sys.path.append('../')
from utils import Utils as utils
from datetime import datetime

process_requestnumber = Blueprint('processrequestnumber', __name__)

collection="process_requestnumber"
@process_requestnumber.route('/administration/process/requestNumber',methods = ['POST'])
def get():
    data = request.get_json()

    while True:
        now = datetime.now()
        rta2={"number":now.strftime(data["format"])}
        rta = Db.findMultiple(collection,rta2,utils.getTenant(request))
        if rta =="[]" :
            break
        else:
            now = datetime.now()
            date_time = now.strftime(data["format"])

    data["number"]=date_time
    data["display"]=now.strftime(data["display"])
    rta["display"]=now.strftime(data["display"])
    Db.insert(collection,data,utils.getTenant(request))
    return rta2
