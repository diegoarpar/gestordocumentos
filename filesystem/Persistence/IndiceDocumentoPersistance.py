import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
import datetime


NOMBRE_BD = "GestorDocumental"
INDICEDOCUMENTO_COLL = "IndiceDocumento"
PUERTO_MONGO = '27018'
HOST_MONGO = 'mongoService'


def crearIndiceDocumento(indiceDocumento):
    conexionMongo = mongoHelper.getConnection(HOST_MONGO, PUERTO_MONGO)
    indiceDocumentoColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, INDICEDOCUMENTO_COLL)
    resultado = indiceDocumentoColl.insert_one(indiceDocumento)
    mongoHelper.closeConnection(conexionMongo)

    return resultado