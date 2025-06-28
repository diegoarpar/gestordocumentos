from flask import Flask
from FileManager.FileManager import fileManager_BP
from flask_cors import CORS



app = Flask(__name__)
app.register_blueprint(fileManager_BP)
cors = CORS(app, resources={"*": {"origins": "*"}})

if __name__ == '__main__':
    app.run()