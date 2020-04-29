import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
from flask import jsonify

NOMBRE_BD = "GestorDocumental"
PERSONA_COLL = "Persona"


def crearCarpetaDocumental(persona):
    conexionMongo = mongoHelper.getConnection("localhost", "27017")
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
    conexionMongo = mongoHelper.getConnection("localhost", "27017")
    query = dataParser.generarFiltro(persona)
    documentCollection = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, PERSONA_COLL)
    carpetaCliente = documentCollection.find_one(query)
    mongoHelper.closeConnection(conexionMongo)

    return carpetaCliente

if __name__ == "__main__":
    persona = {"tipoDocumento":"cc","numeroDocumento":"123456788"}
    carpeta = consultarCarpetaCliente(persona)
    print(carpeta)