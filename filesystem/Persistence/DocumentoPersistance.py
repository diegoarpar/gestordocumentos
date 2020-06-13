import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
import base64
import sys
sys.path.append('../')
from Utilities import ArchivoUtils

NOMBRE_BD = "GestorDocumental"
DOCUMENTO_COLL = "Documento"

def configureDataBase(tenant):
    config = ArchivoUtils.getConfigurations(tenant)
    global MONGO_URI
    MONGO_URI = config['MONGO']['Uri']

def consultarDocumento(documento, tenant):
    configureDataBase(tenant)
    conexionMongo = mongoHelper.getConnection(MONGO_URI)
    filtroConsulta = dataParser.generarFiltro(documento)
    documentoCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant+"_"+DOCUMENTO_COLL)
    documentos = documentoCol.find(filtroConsulta)

    resultado = [x for x in documentos]

    return resultado

def consultarArchivo(rutaDigital):
    data = open(rutaDigital, "rb").read()
    encoded = base64.b64encode(data)
    return encoded

def consultarDocumentosExpediente(expediente, tenant):
    configureDataBase(tenant)
    if len(expediente) > 0:
        filtroExpediente={"_expedienteRef":expediente[0]["_id"]}
    else :
        return []
    conexionMongo = mongoHelper.getConnection(MONGO_URI)
    filtroConsulta = dataParser.generarFiltro(filtroExpediente)
    documentoCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant+"_"+DOCUMENTO_COLL)
    documentos = documentoCol.find(filtroConsulta)

    resultado = [x for x in documentos]

    return resultado

def crearDocumento(documento, tenant):
    configureDataBase(tenant)
    conexionMongo = mongoHelper.getConnection(MONGO_URI)
    documentoCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant+"_"+DOCUMENTO_COLL)

    return documentoCol.insert_one(documento)


if __name__ == "__main__":
    print("Documentos")
