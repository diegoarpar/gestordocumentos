import Helper.MongoDBHelper as mongoHelper

NOMBRE_COLLECCION = "GestorDocumental"
PERSONA_COLL = "Persona"


def crearCarpetaDocumental(persona):
    conexionMongo = mongoHelper.getConnection("localhost", "27017")
    personaColl = mongoHelper.getCollection(conexionMongo, NOMBRE_COLLECCION, PERSONA_COLL)
    queryFindOne = {"numeroDocumento":persona.tipoDocumento, "numeroDocumento":persona.tipoDOcumento}
    resultado = personaColl.find_one(queryFindOne)
    if resultado is None:
        #crear cliente
        persona = personaColl.insert_one(persona)
        conexionMongo.close()
        return persona
    else:
        conexionMongo.close()
        return resultado


def consultarCarpetaCliente(tipoDocumento, numeroDocumento):
    conexionMongo = mongoHelper.getConnection("localhost", "27017")
    query = {"tipoDocumento":tipoDocumento, "numeroDocumento":numeroDocumento}
    documentCollection = mongoHelper.getCollection(conexionMongo, "DocumentStore", "Document")
    carpetaCliente = documentCollection.find_one(query)
    mongoHelper.closeConnection()

    return carpetaCliente

if __name__ == "__main__":
    carpeta = consultarCarpetaCliente("cc", "123456788")
