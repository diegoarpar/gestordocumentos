import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser


NOMBRE_BD = "GestorDocumental"
DOCUMENTO_COLL = "Documento"


def consultarDocumento(documento):
    conexionMongo = mongoHelper.getConnection("localhost", "27017")
    filtroConsulta = dataParser.generarFiltro(documento)
    documentoCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, DOCUMENTO_COLL)
    documentos = documentoCol.find(filtroConsulta)

    resultado = [x for x in documentos]

    return resultado

if __name__ == "__main__":
    #fff
    print("Hola")
