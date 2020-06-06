import Persistence.PersonaPersistance as PersonaPersistance
import Persistence.ExpedientePersistance as ExpedientePersistance
import Persistence.DocumentoPersistance as DocumentoPersistance
import Persistence.IndiceDocumentoPersistance as IndiceDocumentoPersistance
import datetime
import sys
sys.path.append('../')
from Utilities import ArchivoUtils

def radicarDocumentosCliente(persona,numeroSolicitud,tenant):

    if "_id" not in persona:
        personaBD = PersonaPersistance.consultarCarpetaCliente({'tipoDocumento': persona["tipoDocumento"],
                                                    'numeroDocumento': persona["numeroDocumento"]}, tenant)
        if personaBD is None:
            #crear el registro de persona y la carpeta
            persona["carpetaDocumental"] = {
                'fechaCreacion': datetime.datetime.now()
            }
            persona_id = PersonaPersistance.crearCarpetaDocumental(persona, tenant).inserted_id
            persona["_id"] = persona_id

    persona["expediente"]["_personaRef"] = persona["numeroRadicado"]
    expedienteId = ExpedientePersistance.crearExpediente(persona["expediente"],tenant).inserted_id
    config = ArchivoUtils.getConfigurations(tenant)

    for file in persona["documentos"]:
        documento = {}
        documento["nombre"] = file["name"]
        documento["tipo"] = file["type"]
        documento["digitalizado"] = True
        documento["rutaDigital"] = config["BASE"]['fileDir'] +persona["numeroRadicado"]+ '/' + file["name"]
        documento["_expedienteRef"] = expedienteId
        documento["_personaRef"] = persona["_id"]
        documentoId = DocumentoPersistance.crearDocumento(documento,tenant).inserted_id
        indiceDocumento = {}
        indiceDocumento["numeroSolicitud"] = numeroSolicitud
        indiceDocumento["_documentoRef"] = documentoId
        IndiceDocumentoPersistance.crearIndiceDocumento(indiceDocumento)
        ArchivoUtils.almacenarArchivo(file["url"], file["name"], documento["rutaDigital"])