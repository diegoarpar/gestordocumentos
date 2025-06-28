from flask import Flask

from flask_cors import CORS
import sys

sys.path.append('../')
app = Flask(__name__)

from services.process.ServicesProcess import process
from services.process.ServicesProcessRoles import processroles
from services.process.ServicesProcessActivity import process_activity
from services.process.ServicesProcessVariable import process_variable
from services.process.ServicesProcessForm import processform
from services.process.ServicesEmail import email
from services.process.ServicesEmailConfiguration import emailConfiguration
from services.process.ServicesProcessFormConfig import form_config
from services.sedeelectronica.ServicesSedeElectronicaGeneral import sedelectronica_generalconf
from services.ServicesParametricValue import parametricvalue
from threads import SendEmail

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
    app.register_blueprint(process_activity)
    app.register_blueprint(process_variable)
    app.register_blueprint(email)
    app.register_blueprint(form_config)
    app.register_blueprint(emailConfiguration)
    app.register_blueprint(sedelectronica_generalconf)
    cors = CORS(app, resources={"*": {"origins": "*"}})
    app.run(host=appHost,port=appPort,debug=appDebug)