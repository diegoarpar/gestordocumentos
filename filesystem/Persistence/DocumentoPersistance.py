import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser


NOMBRE_BD = "GestorDocumental"
DOCUMENTO_COLL = "Documento"


def consultarDocumento(expediente):
    conexionMongo = mongoHelper.getConnection("localhost", "27017")
    filtroConsulta = dataParser.generarFiltro(expediente)
    expedienteCol = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, DOCUMENTO_COLL)
    expedientes = expedienteCol.find(filtroConsulta)

    resultado = [x for x in expedientes]

    return resultado

if __name__ == "__main__":
    #fff
    print("Hola")
