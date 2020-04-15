import os, configparser, Persistence.DocumentPersistence as DocumentPersistence
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename


fileManager_BP = Blueprint("FileManager", __name__)
uploadFolder = "/home/osboxes/files/"


@fileManager_BP.route('/multipart-upload', methods=['POST'])
def upload():
    config = configparser.ConfigParser()
    config.read("./FileManager/config/FileManager.ini")
    file = request.files['file']
    request.

    filename = secure_filename(file.filename)
    file.save(os.path.join(config["TENANT1"]["file_dir"], filename))
    DocumentPersistence.consultarCarpetaCliente(tipoDocumento,numeroDocumento)
    resp = jsonify({'message': 'File successfully uploaded'})
    resp.status_code = 201
    return resp

def obtenerDocumentosCliente():
