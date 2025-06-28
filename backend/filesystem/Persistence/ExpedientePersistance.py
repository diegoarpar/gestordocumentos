import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
import datetime

import sys
sys.path.append('../')
from Utilities import ArchivoUtils

NOMBRE_BD = "GestorDocumental"
EXPEDIENTE_COLL = "Expediente"

def configureDataBase(tenant):
    config = ArchivoUtils.getConfigurations(tenant)
    global MONGO_URI
    MONGO_URI = config['MONGO']['Uri']

def asociarExpedienteCarpeta(expediente, tenant):
    configureDataBase(tenant)
    conexionMongo = mongoHelper.getConnection(MONGO_URI, tenant)
    expedienteColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant + "_"+EXPEDIENTE_COLL)
    resultado = expedienteColl.update_one({"_id": expediente["_id"]}, expediente)
    mongoHelper.closeConnection(conexionMongo)

    return resultado


def crearExpediente(expediente, tenant):
    configureDataBase(tenant)
    conexionMongo = mongoHelper.getConnection(MONGO_URI)
    expedienteColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant + "_"+ EXPEDIENTE_COLL)
    expediente["fechaCreacion"] = datetime.datetime.now()
    expediente["estado"] = 'ACTIVO'
    resultado = expedienteColl.insert_one(expediente)
    mongoHelper.closeConnection(conexionMongo)

    return resultado


def consultarExpediente(expediente, tenant):
    configureDataBase(tenant)
    conexionMongo = mongoHelper.getConnection(MONGO_URI)
    filtroConsulta = dataParser.generarFiltro(expediente)
    expedienteCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant + "_"+ EXPEDIENTE_COLL)
    expedientes = expedienteCol.find(filtroConsulta)

    resultado = [x for x in expedientes]

    return resultado

if __name__ == "__main__":
    #fff
    print("Expediente")
