from flask_pymongo import PyMongo
from bson.json_util import dumps
import sys
sys.path.append('../')
from utils import Utils
from flask import g

def configureMongoDB(app):
    global  appCopy
    appCopy=app

def getMongoConnection(tenant):
    g.db = getMongoConnectionCXT(tenant)
    return g.db

def getMongoConnectionCXT(tenant):
    config = Utils.getConfigurations(tenant);
    uri=config['mongoApp']['Uri']
    database=config['mongoApp']['Database']
    userdb=config['mongoApp']['User']
    passdb=config['mongoApp']['Password']
    mongoHead=config['mongoApp']['Head']
    fullUri=mongoHead + userdb + ":" + passdb +"@"+ uri + database
    appCopy.config["MONGO_URI"] =fullUri
    try:
        global mongo
        mongo = PyMongo(appCopy)
        #print ("mongo connected")
    except Exception as e:
        print("full mongo uri"+fullUri)
        print ("mongo no connection"+ str(e))
    return mongo

def insert(collection,object,tenant):
    getMongoConnection(tenant)
    mongo.db[tenant+"_"+collection].insert_one(object)

def update(collection,object, newObject,tenant):
    getMongoConnection(tenant)
    mongo.db[tenant+"_"+collection].update_one(object,{ "$set":newObject})

def find(collection,object,tenant):
    getMongoConnection(tenant)
    rta=mongo.db[tenant+"_"+collection].find_one(object)
    return dumps(rta)

def remove(collection,object,tenant):
    getMongoConnection(tenant)
    rta=mongo.db[tenant+"_"+collection].remove(object)
    return dumps(rta)

def findMultiple(collection,object,tenant):
    getMongoConnection(tenant)
    rta=mongo.db[tenant+"_"+collection].find(object)

    return dumps(rta)