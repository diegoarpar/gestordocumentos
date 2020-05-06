from flask import Flask

import configparser
from flask_cors import CORS
import sys

sys.path.append('../')
app = Flask(__name__)

from services.Services import app1
from services.Kong import app2
from services.ServicesUserAdministrator import app3

if __name__ == '__main__':
    config = configparser.ConfigParser()
    config.read('../config/configAutentication.ini')

    appPort=config['app']['Port']
    appHost=config['app']['Host']
    if config['app']['Debug']=='False':
        appDebug=False
    else:
        appDebug=True
    from db import Db
    Db.configureMongoDB(app,config)
    #cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    cors = CORS(app, resources={"*": {"origins": "*"}})

    app.register_blueprint(app1)
    app.register_blueprint(app2)
    app.register_blueprint(app3)
    app.run(host=appHost,port=appPort,debug=appDebug)


