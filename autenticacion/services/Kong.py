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

    urlHost=createHosts()
    data = request.get_json()
    servicename=data["servicename"]
    url=data["url"]
    consumerhosts=data["consumerhosts"]
    gatewaypaths=data["gatewaypaths"]
    methods=data["methods"]
    scope=data["scopes"]
    origins=data["origins"]
    resp=createService(urlHost,url,servicename)
    if resp.status_code == 201 or resp.status_code == 200:
        serviceId=resp.json()["id"]
        resp=createServiceRoute(urlHost,consumerhosts,servicename)
        if resp.status_code == 201 or resp.status_code == 200:
            resp=createRouteGateway(urlHost,serviceId,consumerhosts,gatewaypaths,methods)
            routeId=resp.json()["id"]
            if resp.status_code == 201 or resp.status_code == 200:
                resp=createOatuh(urlHost,servicename,scope)
                if resp.status_code == 201 or resp.status_code == 200:
                    resp=createPluginCors(urlHost,servicename,origins)
                    if resp.status_code == 201 or resp.status_code == 200:
                        resp=createPluginCorsRoute(urlHost,routeId,origins)


    return resp.json()

@app2.route('/kongkong/registerservice/',methods = ['POST'])
def registerservice():
    urlHost=createHosts()
    data = request.get_json()
    servicename=data["servicename"]
    url=data["url"]
    consumerhosts=data["consumerhosts"]
    gatewaypaths=data["gatewaypaths"]
    methods=data["methods"]
    scope=data["scopes"]
    origins=data["origins"]
    resp=createService(urlHost,url,servicename)
    if resp.status_code == 201 or resp.status_code == 200:
        serviceId=resp.json()["id"]
        resp=createServiceRoute(urlHost,consumerhosts,servicename)
        if resp.status_code == 201 or resp.status_code == 200:
            resp=createRouteGateway(urlHost,serviceId,consumerhosts,gatewaypaths,methods)
            routeId=resp.json()["id"]
            if resp.status_code == 201 or resp.status_code == 200:
                resp=createPluginCors(urlHost,servicename,origins)
                if resp.status_code == 201 or resp.status_code == 200:
                    resp=createPluginCorsRoute(urlHost,routeId,origins)

    return resp.json()


def createOatuh(urlHost,servicename,scope):
    jsondata={"name":"oauth2",
              "config":{"enable_authorization_code":True,
                        "global_credentials":True,
                        "enable_password_grant":True,
                        "accept_http_if_already_terminated":False,
                        "scopes":scope,
                        "mandatory_scope":True
                        }
              }
    resp=requests.post(urlHost+'/services/'+servicename+"/plugins",json=jsondata)
    print('Created oauth seriuce '+format(resp.json()))
    return resp

def createRouteGateway(urlHost,serviceId,consumerhosts,gatewaypaths,methods):
    jsondata={"hosts":consumerhosts, "paths":gatewaypaths,"service":{"id":serviceId},"methods":methods, "protocols":["http","https"]}
    resp=requests.post(urlHost+'/routes/',json=jsondata)
    print('Created route gateway '+format(resp.json()))
    return resp

def createServiceRoute(urlHost,consumerhosts,servicename):
    jsondata={"hosts":consumerhosts}
    resp=requests.post(urlHost+'/services/'+servicename+'/routes',json=jsondata)
    print('Created service route'+format(resp.json()))
    return resp

def createService(urlHost,url,servicename):
    jsondata={"name":servicename, "url":url}
    resp = requests.post(urlHost+'/services/',json=jsondata)
    print('Created service '+format(resp.json()))
    return resp

def createPluginCors(urlHost,servicename,hosts):
    jsondata={"name":"cors",
              "config":{"origins":hosts
                        }
              }
    resp=requests.post(urlHost+'/services/'+servicename+"/plugins",json=jsondata)
    print('Created  seruice cors '+format(resp.json()))
    return resp

def createPluginCorsRoute(urlHost,routeId,hosts):
    jsondata={"name":"cors",
              "config":{"origins":hosts
                        }
              }
    resp=requests.post(urlHost+'/routes/'+routeId+"/plugins",json=jsondata)
    print('Created  seruice cors route '+format(resp.json()))
    return resp

def createHosts():
    config = configparser.ConfigParser()
    config.read('../config/configAutentication.ini')
    amPort=config['am']['Port']
    amHost=config['am']['Host']
    amProtocol=config['am']['Protocol']
    return amProtocol+'://'+amHost+":"+amPort