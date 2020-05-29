import os, configparser
import Persistence.PersonaPersistance as PersonaPersistance
import Persistence.ExpedientePersistance as ExpedientePersistance
import Persistence.DocumentoPersistance as DocumentoPersistance
import Business.CarpetaDocumental as CarpetaDocumental
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from bson.json_util import dumps,loads


fileManager_BP = Blueprint("FileManager", __name__)
uploadFolder = "/home/osboxes/files/"

@fileManager_BP.route('/carpetaDocumental/', methods=['POST'])
def crearCarpetaCliente():
    inputData = request.get_json()
    carpeta = PersonaPersistance.crearCarpetaDocumental(inputData)
    res = jsonify(carpeta)
    res.status_code = 200

    return res

@fileManager_BP.route('/carpetaDocumental/cliente', methods=['POST'])
def consultarCarpetaCliente():
    inputData = request.get_json()
    carpeta = PersonaPersistance.consultarCarpetaCliente(inputData)
    queryExpediente = {"_personaRef": carpeta["_id"]}
    expedientes = ExpedientePersistance.consultarExpediente(queryExpediente)
    carpeta["expedientes"] = []
    for expediente in expedientes:
        queryDocumento = {"_expedienteRef":expediente["_id"]}
        documentos = DocumentoPersistance.consultarDocumento(queryDocumento)
        expediente["documentos"] = documentos
        carpeta["expedientes"].append(expediente)

    res = jsonify({})
    res.set_data(dumps(carpeta))
    res.status_code = 200

    return res

@fileManager_BP.route('/carpetaDocumental/radicarDocumentosCliente', methods=["POST"])
def radicarDocumentosCliente():
    print("llego")
    inputData = request.get_json()
    CarpetaDocumental.radicarDocumentosCliente(inputData, inputData.get("numeroRadicado"))

    res = jsonify({})
    res.status_code = 200

    return res


@fileManager_BP.route('/multipart-upload', methods=['POST'])
def upload():
    idCarpetaDocumental = request.form["idCarpetaDocumental"]
    request.cookies
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
