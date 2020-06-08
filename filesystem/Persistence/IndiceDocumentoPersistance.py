import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
import datetime
import sys
sys.path.append('../')
from Utilities import ArchivoUtils

NOMBRE_BD = "GestorDocumental"
INDICEDOCUMENTO_COLL = "IndiceDocumento"

def configureDataBase(tenant):
    config = ArchivoUtils.getConfigurations(tenant)
    global MONGO_URI
    MONGO_URI = config['MONGO']['Uri']

def crearIndiceDocumento(indiceDocumento, tenant):
    configureDataBase(tenant)
    conexionMongo = mongoHelper.getConnection(MONGO_URI)
    indiceDocumentoColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant+"_"+INDICEDOCUMENTO_COLL)
    resultado = indiceDocumentoColl.insert_one(indiceDocumento)
    mongoHelper.closeConnection(conexionMongo)

    return resultado