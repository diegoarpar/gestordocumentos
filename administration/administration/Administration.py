from flask import Flask


from flask_cors import CORS
import sys

sys.path.append('../')
app = Flask(__name__)

from services.process.ServicesProcess import process
from services.process.ServicesProcessRoles import processroles
from services.process.ServicesProcessForm import processform
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
    app.register_blueprint(processroles)
    app.register_blueprint(parametricvalue)
    app.register_blueprint(processform)

    cors = CORS(app, resources={"*": {"origins": "*"}})
    app.run(host=appHost,port=appPort,debug=appDebug)