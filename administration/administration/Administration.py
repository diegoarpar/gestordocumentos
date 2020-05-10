from flask import Flask


from flask_cors import CORS
import sys

sys.path.append('../')
app = Flask(__name__)

from services.ServicesProcess import process
from services.ServicesParametricValue import parametricvalue
from db import Db
from utils import Utils

if __name__ == '__main__':
    config = Utils.getConfigurations("")

    appPort=config['app']['Port']
    appHost=config['app']['Host']
    if config['app']['Debug']=='False':
        appDebug=False
    else:
        appDebug=True

    Db.configureMongoDB(app)

    app.register_blueprint(process)
    app.register_blueprint(parametricvalue)

    cors = CORS(app, resources={"*": {"origins": "*"}})
    app.run(host=appHost,port=appPort,debug=appDebug)