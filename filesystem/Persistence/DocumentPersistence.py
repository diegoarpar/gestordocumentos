import Helper.MongoDBHelper as mongoHelper

NOMBRE_COLLECCION = "Document"


def crearDocumento(documento):
    documentCollection = mongoHelper.__getCollection__("localhost", "27017", "DocumentStore", "Document")


def consultarCarpetaCliente(tipoDocumento, numeroDocumento):
    query = {"tipoDocumento":tipoDocumento, "numeroDocumento":numeroDocumento}
    queryColumns ={"_id": 0}
    documentCollection = mongoHelper.__getCollection__("localhost", "27017", "DocumentStore", "Document")
    carpetaCliente = documentCollection.find_one(query, queryColumns)

    return carpetaCliente

if __name__ == "__main__":
    carpeta = consultarCarpetaCliente("cc", "123456788")
