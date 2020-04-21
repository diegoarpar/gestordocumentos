import os, configparser, Persistence.PersonaPersistance as PersonaPersistance
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from bson.json_util import dumps,RELAXED_JSON_OPTIONS


fileManager_BP = Blueprint("FileManager", __name__)
uploadFolder = "/home/osboxes/files/"

@fileManager_BP.route('/carpetaDocumental/', methods=['POST'])
def crearCarpetaCliente():
    inputData = request.get_json()
    carpeta = PersonaPersistance.crearCarpetaDocumental(inputData)
    res = jsonify(carpeta)
    res.status_code = 200

    return res

@fileManager_BP.route('/carpetaDocumental/', methods=['GET'])
def consultarCarpetaCliente():
    inputData = request.get_json()
    carpeta = PersonaPersistance.consultarCarpetaCliente(inputData)
    res = jsonify({})
    res.set_data(dumps(carpeta))
    res.status_code = 200

    return res

@fileManager_BP.route('/multipart-upload', methods=['POST'])
def upload():
    idCarpetaDocumental = request.form["idCarpetaDocumental"]
    config = configparser.ConfigParser()
    config.read("./FileManager/config/FileManager.ini")
    file = request.files['file']
    request.form['file']
    # Creación archivo
    filename = secure_filename(file.filename)
    file.save(os.path.join(config["TENANT1"]["file_dir"], filename))
    # registro
    PersonaPersistance.consultarCarpetaCliente(tipoDocumento, numeroDocumento)
    res = jsonify({'message': 'File successfully uploaded'})
    res.status_code = 201

    return res
