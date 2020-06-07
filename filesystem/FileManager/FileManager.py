import os, configparser
import Persistence.PersonaPersistance as PersonaPersistance
import Persistence.ExpedientePersistance as ExpedientePersistance
import Persistence.DocumentoPersistance as DocumentoPersistance
import Business.CarpetaDocumental as CarpetaDocumental
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from bson.json_util import dumps,loads
import sys

sys.path.append('../')
from Utilities import ArchivoUtils

fileManager_BP = Blueprint("FileManager", __name__)

@fileManager_BP.route('/carpetaDocumental/', methods=['POST'])
def crearCarpetaCliente():
    tenant = ArchivoUtils.getTenant(request)
    inputData = request.get_json()
    carpeta = PersonaPersistance.crearCarpetaDocumental(inputData,tenant)
    res = jsonify(carpeta)
    res.status_code = 200

    return res

@fileManager_BP.route('/carpetaDocumental/cliente', methods=['POST'])
def consultarCarpetaCliente():
    tenant = ArchivoUtils.getTenant(request)
    inputData = request.get_json()
    carpeta = PersonaPersistance.consultarCarpetaCliente(inputData,tenant)
    queryExpediente = {"_personaRef": carpeta["numeroRadicado"]}
    expedientes = ExpedientePersistance.consultarExpediente(queryExpediente,tenant)
    carpeta["expedientes"] = []
    for expediente in expedientes:
        queryDocumento = {"_expedienteRef":expediente["_id"]}
        documentos = DocumentoPersistance.consultarDocumento(queryDocumento, tenant)
        expediente["documentos"] = documentos
        carpeta["expedientes"].append(expediente)

    res = jsonify({})
    res.set_data(dumps(carpeta))
    res.status_code = 200

    return res

@fileManager_BP.route('/carpetaDocumental/radicarDocumentosCliente', methods=["POST"])
def radicarDocumentosCliente():
    tenant = ArchivoUtils.getTenant(request)
    inputData = request.get_json()
    CarpetaDocumental.radicarDocumentosCliente(inputData, inputData.get("numeroRadicado"),tenant)

    res = jsonify({})
    res.status_code = 200

    return res


@fileManager_BP.route('/multipart-upload', methods=['POST'])
def upload():
    idCarpetaDocumental = request.form["idCarpetaDocumental"]
    request.cookies
    tenant = ArchivoUtils.getTenant(request)
    config = ArchivoUtils.getConfigurations(tenant)
    file = request.files['file']
    request.form['file']
    # Creación archivo
    filename = secure_filename(file.filename)
    file.save(os.path.join(config["BASE"]["fileDir"], filename))
    # registro
    PersonaPersistance.consultarCarpetaCliente(idCarpetaDocumental, tenant)
    res = jsonify({'message': 'File successfully uploaded'})
    res.status_code = 201

    return res
