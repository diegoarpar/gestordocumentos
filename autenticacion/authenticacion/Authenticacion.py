from flask import Flask

import configparser
from flask_cors import CORS
from db import Db
from services.Services import app1

app = Flask(__name__)


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
    cors = CORS(app, resources={"*": {"origins": "*"}})
    app.register_blueprint(app1)
    app.run(host=appHost,port=appPort,debug=appDebug)


