from flask import Flask


from flask_cors import CORS
import sys

sys.path.append('../')
app = Flask(__name__)

from services.ServicesUsers import app1
from services.Kong import app2
from services.ServicesUserManage import app3
from services.ServicesRoles import app4
from services.ServicesProcessRoles import procesroles
from services.ServicesTenant import app5
from services.ServicesPortals import app6
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
    #cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


    app.register_blueprint(app1)
    app.register_blueprint(app2)
    app.register_blueprint(app3)
    app.register_blueprint(app4)
    app.register_blueprint(app5)
    app.register_blueprint(app6)
    app.register_blueprint(procesroles)
    cors = CORS(app, resources={"*": {"origins": "*"}})
    app.run(host=appHost,port=appPort,debug=appDebug)


