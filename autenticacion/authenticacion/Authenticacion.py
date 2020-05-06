from flask import Flask

import configparser
from flask_cors import CORS
import sys

sys.path.append('../')
app = Flask(__name__)

from services.Services import app1
from services.Kong import app2
from services.ServicesUserAdministrator import app3
from services.ServicesRoles import app4
from services.ServicesTenant import app5
from db import Db

if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read('../config/configAutentication.ini')

    appPort=config['app']['Port']
    appHost=config['app']['Host']
    if config['app']['Debug']=='False':
        appDebug=False
    else:
        appDebug=True

    Db.configureMongoDB(app,config)
    #cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


    app.register_blueprint(app1)
    app.register_blueprint(app2)
    app.register_blueprint(app3)
    app.register_blueprint(app4)
    app.register_blueprint(app5)
    cors = CORS(app, resources={"*": {"origins": "*"}})
    app.run(host=appHost,port=appPort,debug=appDebug)


