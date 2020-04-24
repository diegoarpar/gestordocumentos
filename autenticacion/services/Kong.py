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

app2 = Blueprint('app12', __name__)

@app2.route('/kongkong/registerserviceoauth/',methods = ['POST'])
def registerserviceoauth():
    config = configparser.ConfigParser()
    config.read('../config/configAutentication.ini')

    amPort=config['am']['Port']
    amHost=config['am']['Host']
    amProtocol=config['am']['Protocol']

    data = request.get_json()
    servicename=data["servicename"]
    url=data["url"]
    consumerhosts=data["consumerhosts"]
    gatewaypaths=data["gatewaypaths"]
    methods=data["methods"]
    scope=data["scopes"]

    jsondata={"name":servicename, "url":url}
    resp = requests.post(amProtocol+'://'+amHost+":"+amPort+'/services/',json=jsondata)
    print('Created service '+format(resp.json()))
    if resp.status_code == 201 or resp.status_code == 200:
        service={"id":resp.json()["id"]}
        jsondata={"hosts":consumerhosts}
        resp=requests.post(amProtocol+'://'+amHost+":"+amPort+'/services/'+servicename+'/routes',json=jsondata)
        print('Created service route'+format(resp.json()))
        if resp.status_code == 201 or resp.status_code == 200:
            jsondata={"hosts":consumerhosts, "paths":gatewaypaths,"service":service,"methods":methods, "protocols":["http","https"]}
            resp=requests.post(amProtocol+'://'+amHost+":"+amPort+'/routes/',json=jsondata)
            print('Created route gateway '+format(resp.json()))
            if resp.status_code == 201 or resp.status_code == 200:
                jsondata={"name":"oauth2",
                          "config":{"enable_authorization_code":True,
                                    "global_credentials":True,
                                    "enable_password_grant":True,
                                    "accept_http_if_already_terminated":False,
                                    "scopes":scope,
                                    "mandatory_scope":True
                                    }
                          }
                resp=requests.post(amProtocol+'://'+amHost+":"+amPort+'/services/'+servicename+"/plugins",json=jsondata)
                print('Created oauth seriuce '+format(resp.json()))

    return resp.json()

@app2.route('/kongkong/registerservice/',methods = ['POST'])
def registerservice():
    config = configparser.ConfigParser()
    config.read('../config/configAutentication.ini')

    amPort=config['am']['Port']
    amHost=config['am']['Host']
    amProtocol=config['am']['Protocol']

    data = request.get_json()
    servicename=data["servicename"]
    url=data["url"]
    consumerhosts=data["consumerhosts"]
    gatewaypaths=data["gatewaypaths"]
    methods=data["methods"]
    scope=data["scopes"]

    jsondata={"name":servicename, "url":url}
    resp = requests.post(amProtocol+'://'+amHost+":"+amPort+'/services/',json=jsondata)
    print('Created service '+format(resp.json()))
    if resp.status_code == 201 or resp.status_code == 200:
        service={"id":resp.json()["id"]}
        jsondata={"hosts":consumerhosts}
        resp=requests.post(amProtocol+'://'+amHost+":"+amPort+'/services/'+servicename+'/routes',json=jsondata)
        print('Created service route'+format(resp.json()))
        if resp.status_code == 201 or resp.status_code == 200:
            jsondata={"hosts":consumerhosts, "paths":gatewaypaths,"service":service,"methods":methods, "protocols":["http","https"]}
            resp=requests.post(amProtocol+'://'+amHost+":"+amPort+'/routes/',json=jsondata)
            print('Created route gateway '+format(resp.json()))
            if resp.status_code == 201 or resp.status_code == 200:
                jsondata={"name":"oauth2",
                          "config":{"enable_authorization_code":True,
                                    "global_credentials":True,
                                    "enable_password_grant":True,
                                    "accept_http_if_already_terminated":False,
                                    "scopes":scope,
                                    "mandatory_scope":True
                                    }
                          }
                #resp=requests.post(amProtocol+'://'+amHost+":"+amPort+'/services/'+servicename+"/plugins",json=jsondata)
                print('Created oauth seriuce '+format(resp.json()))

    return resp.json()