from flask_pymongo import PyMongo
from bson.json_util import dumps

def configureMongoDB(app,config):

    uri=config['mongoApp']['Uri']
    database=config['mongoApp']['Database']
    userdb=config['mongoApp']['User']
    passdb=config['mongoApp']['Password']
    mongoHead=config['mongoApp']['Head']
    fullUri=mongoHead + userdb + ":" + passdb +"@"+ uri + database
    app.config["MONGO_URI"] =fullUri

    try:
        global mongo
        mongo = PyMongo(app)
        print ("mongo connected")
    except:
        print ("mongo no connection")

    return mongo

def insert(collection,object):
    mongo.db[collection].insert_one(object)

def find(collection,object):
    rta=mongo.db[collection].find_one(object)
    return dumps(rta)