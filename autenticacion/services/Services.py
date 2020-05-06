from flask import Blueprint
from db import Db
from flask_api import status
from flask import request
from flask import jsonify
from bson.json_util import dumps, loads
import configparser
import requests
import sys
sys.path.append('../')
from utils import Utils as utils

app1 = Blueprint('app11', __name__)

@app1.route('/helloworld')
def hello_world():
    return 'Hello World!'


@app1.route('/authentication/validateuser/',methods = ['POST'])
def validateUser():
    data = request.get_json()
    password=data["password"]
    user=data["user"]
    #password = sha256(password.encode('utf-8').rstrip()).hexdigest()
    objectToFind={"user": user,"password":password}
    userRta = Db.find(utils.getTenant(request)+"_usersdb",objectToFind)

    if userRta=='null':
        return jsonify({"message": "user/password incorrect","flag":False}),status.HTTP_401_UNAUTHORIZED
    return registerConsumerGetToken(user)

@app1.route('/authentication/changePassword/',methods = ['POST'])
def changePassword():
    data = request.get_json()
    currentpassword=data["currentpassword"]
    newpassword=data["newpassword"]
    user=data["user"]
    objectToFind={"user": user,"password":currentpassword}
    userRta = Db.find("usersdb",objectToFind)
    objectToFind= loads(Db.find(utils.getTenant(request)+"_usersdb",objectToFind))
    if userRta=='null':
        return jsonify({"message": "password not changed","flag":False,"token":token}),status.HTTP_401_UNAUTHORIZED
    userRta=loads(userRta)
    userRta["password"]=newpassword
    Db.update(utils.getTenant(request)+"_usersdb",objectToFind,userRta)
    return jsonify({"message": "password changed","flag":True})

@app1.route('/authentication/createuser/',methods = ['POST'])
def createUser():
    data = request.get_json()
    user=data["user"]
    objectToFind={"user": user}
    userRta = Db.find(utils.getTenant(request)+"_usersdb",objectToFind)
    if userRta=="null":
        Db.insert(utils.getTenant(request)+"_usersdb",data)
        return jsonify({"message": "user created","flag":True})
    return jsonify({"message": "user not created ","flag":True})

@app1.route('/authentication/refreshtoken/',methods = ['POST'])
def refreshToken():
    data = request.get_json()
    user=data["user"]
    token=data["refresh_token"]
    return refreshTokenUser(user,token)


def registerConsumerGetToken(user):
    config = configparser.ConfigParser()
    config.read('../config/configAutentication.ini')

    amPort=config['am']['Port']
    amHost=config['am']['Host']
    amProtocol=config['am']['Protocol']
    sessionTime=config['am']['SessionTime']

    jsonInfo={"username":user,"custom_id":user}
    resp = requests.post(amProtocol+'://'+amHost+":"+amPort+'/consumers/', json=jsonInfo)
    if resp.status_code != 201:
        print ('POST /consumer/ {}'+format(resp.status_code))
        if resp.status_code == 400 or resp.status_code == 409:
            resp = requests.get('http://'+amHost+":"+amPort+'/consumers/'+user)
            consumerId=resp.json()["id"];
            print('consumer. ID: {}'+consumerId)
            booleanConsumerExist=True
    elif resp.status_code != 200 or resp.status_code != 201:
        consumerId=resp.json()["id"];
        print('Created consumer. ID: {}'+format(resp.json()))


    jsonInfo={"name":"gestor","client_id":user,"client_secret":user,"redirect_uris":["http://192.168.0.16:7001"]}
    resp = requests.post(amProtocol+'://'+amHost+":"+amPort+'/consumers/'+consumerId+"/oauth2", json=jsonInfo)
    oauthId=""
    if resp.status_code != 201:
        print ('POST /oatuh credential/ {}'+format(resp.status_code))
        if resp.status_code == 400 or resp.status_code == 409:
            resp = requests.get('http://'+amHost+":"+amPort+'/consumers/'+consumerId+'/oauth2')
            print('consumer. ID: {}'+format(resp.json()))
            oauthId=resp.json()["data"][0]["id"]
            print('oauth register. ID: {}'+oauthId)

    elif resp.status_code != 200 or resp.status_code != 201:
        oauthId=resp.json()["id"]
        print('Created oatuh credential. ID: {}'+format(resp.json()))

    jsonInfo={"credential":{"id":oauthId},"expires_in":int (sessionTime),"scope":"out","authenticated_userid":user}
    resp = requests.post(amProtocol+'://'+amHost+":"+amPort+'/oauth2_tokens/', json=jsonInfo)
    print('Created oatuh credential. ID: {}'+format(resp.json()))

    return resp.json()


def refreshTokenUser(user,token):
    config = configparser.ConfigParser()
    config.read('../config/configAutentication.ini')

    amPort=config['am']['Port']
    amHost=config['am']['Host']
    amProtocol=config['am']['Protocol']


    resp = requests.get(amProtocol+'://'+amHost+":"+amPort+'/oauth2_tokens/'+token)
    if resp.status_code == 201 or resp.status_code == 200:
        requests.delete(amProtocol+'://'+amHost+":"+amPort+'/oauth2_tokens/'+token)
        return registerConsumerGetToken(user)
    return resp.json()
