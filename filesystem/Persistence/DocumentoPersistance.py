import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser


NOMBRE_BD = "GestorDocumental"
DOCUMENTO_COLL = "Documento"
PUERTO_MONGO = '27018'
HOST_MONGO = 'mongoService'

def consultarDocumento(documento):
    conexionMongo = mongoHelper.getConnection(HOST_MONGO, PUERTO_MONGO)
    filtroConsulta = dataParser.generarFiltro(documento)
    documentoCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, DOCUMENTO_COLL)
    documentos = documentoCol.find(filtroConsulta)

    resultado = [x for x in documentos]

    return resultado

def crearDocumento(documento):
    conexionMongo = mongoHelper.getConnection(HOST_MONGO, PUERTO_MONGO)
    documentoCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, DOCUMENTO_COLL)

    return documentoCol.insert_one(documento)


if __name__ == "__main__":
    #fff
    print("Hola")
