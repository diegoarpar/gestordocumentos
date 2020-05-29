import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
import datetime


NOMBRE_BD = "GestorDocumental"
EXPEDIENTE_COLL = "Expediente"
PUERTO_MONGO = '27018'
HOST_MONGO = 'mongoService'


def asociarExpedienteCarpeta(expediente):
    conexionMongo = mongoHelper.getConnection(HOST_MONGO, PUERTO_MONGO)
    expedienteColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, EXPEDIENTE_COLL)
    resultado = expedienteColl.update_one({"_id": expediente["_id"]}, expediente)
    mongoHelper.closeConnection(conexionMongo)

    return resultado


def crearExpediente(expediente):
    conexionMongo = mongoHelper.getConnection(HOST_MONGO, PUERTO_MONGO)
    expedienteColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, EXPEDIENTE_COLL)
    expediente["fechaCreacion"] = datetime.datetime.now()
    expediente["estado"] = 'ACTIVO'
    resultado = expedienteColl.insert_one(expediente)
    mongoHelper.closeConnection(conexionMongo)

    return resultado


def consultarExpediente(expediente):
    conexionMongo = mongoHelper.getConnection(HOST_MONGO, PUERTO_MONGO)
    filtroConsulta = dataParser.generarFiltro(expediente)
    expedienteCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, EXPEDIENTE_COLL)
    expedientes = expedienteCol.find(filtroConsulta)

    resultado = [x for x in expedientes]

    return resultado

if __name__ == "__main__":
    #fff
    print("Hola")
