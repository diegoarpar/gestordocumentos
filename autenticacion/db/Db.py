from flask_pymongo import PyMongo
from bson.json_util import dumps
import sys
sys.path.append('../')

def configureMongoDB(app,config):

    uri=config['mongoApp']['Uri']
    database=config['mongoApp']['Database']
    userdb=config['mongoApp']['User']
    passdb=config['mongoApp']['Password']
    mongoHead=config['mongoApp']['Head']
    fullUri=mongoHead + userdb + ":" + passdb +"@"+ uri + database
    app.config["MONGO_URI"] =fullUri
    print("full mongo uri"+fullUri)

    try:
        global mongo
        mongo = PyMongo(app)
        print ("mongo connected")
    except Exception as e:
        print ("mongo no connection"+ str(e))

    return mongo

def insert(collection,object):
    mongo.db[collection].insert_one(object)

def update(collection,object, newObject):
    mongo.db[collection].update_one(object,{ "$set":newObject})

def find(collection,object):
    rta=mongo.db[collection].find_one(object)
    return dumps(rta)

def findMultiple(collection,object):
    rta=mongo.db[collection].find(object)
    return dumps(rta)