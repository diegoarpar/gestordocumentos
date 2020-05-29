import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
from flask import jsonify

NOMBRE_BD = "GestorDocumental"
PERSONA_COLL = "Persona"
PUERTO_MONGO = '27018'
HOST_MONGO = 'mongoService'

def crearCarpetaDocumental(persona):
    conexionMongo = mongoHelper.getConnection(HOST_MONGO, PUERTO_MONGO)
    personaColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, PERSONA_COLL)
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


def consultarCarpetaCliente(persona):
    conexionMongo = mongoHelper.getConnection(HOST_MONGO, PUERTO_MONGO)
    query = dataParser.generarFiltro(persona)
    documentCollection = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, PERSONA_COLL)
    carpetaCliente = documentCollection.find_one(query)
    mongoHelper.closeConnection(conexionMongo)

    return carpetaCliente

if __name__ == "__main__":
    persona = {"tipoDocumento":"cc","numeroDocumento":"123456788"}
    carpeta = consultarCarpetaCliente(persona)
    print(carpeta)