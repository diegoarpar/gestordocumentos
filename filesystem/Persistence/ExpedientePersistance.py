import Helper.MongoDBHelper as mongoHelper
import Utilities.DataParser as dataParser
import

NOMBRE_BD = "GestorDocumental"
EXPEDIENTE_COLL = "Expediente"

def asociarExpedienteCarpeta(expediente):
    conexionMongo = mongoHelper.getConnection("127.0.0.1", "27017")
    expedienteColl = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, EXPEDIENTE_COLL)
    resultado = expedienteColl.update_one({"_id":expediente["_id"]}, expediente)
    mongoHelper.closeConnection(conexionMongo)

    return resultado


def consultarExpediente(expediente):
    conexionMongo = mongoHelper.getConnection("localhost", "27017")
    filtroConsulta = dataParser.generarFiltro(expediente)
    expediente = mongoHelper.getCollection(conexionMongo, NOMBRE_BD, EXPEDIENTE_COLL)
    return expediente

if __name__ == "__main__":
    #fff
    print("Hola")
