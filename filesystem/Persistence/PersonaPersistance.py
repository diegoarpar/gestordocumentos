import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
import sys
from flask import jsonify
sys.path.append('../')
from Utilities import ArchivoUtils

NOMBRE_BD = "GestorDocumental"
PERSONA_COLL = "Persona"

def configureDataBase(tenant):
    config = ArchivoUtils.getConfigurations(tenant)
    global MONGO_URI
    MONGO_URI = config['MONGO']['Uri']

def crearCarpetaDocumental(persona, tenant):
    configureDataBase(tenant)
    conexionMongo = mongoHelper.getConnection(MONGO_URI)
    personaColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant+"_"+PERSONA_COLL)
    queryFindOne = dataParser.generarFiltro(persona)
    resultado = personaColl.find_one(queryFindOne)
    if resultado is None:
        #crear cliente
        persona = personaColl.insert_one(persona)
        mongoHelper.closeConnection(conexionMongo)
        return persona
    else:
        mongoHelper.closeConnection(conexionMongo)
        return resultado


def consultarCarpetaCliente(persona,tenant):
    configureDataBase(tenant)
    conexionMongo = mongoHelper.getConnection(MONGO_URI)
    query = dataParser.generarFiltro(persona)
    documentCollection = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, tenant+"_"+PERSONA_COLL)
    carpetaCliente = documentCollection.find_one(query)
    mongoHelper.closeConnection(conexionMongo)

    return carpetaCliente

if __name__ == "__main__":
    persona = {"tipoDocumento":"cc","numeroDocumento":"123456788"}
    carpeta = consultarCarpetaCliente(persona)
    print(carpeta)