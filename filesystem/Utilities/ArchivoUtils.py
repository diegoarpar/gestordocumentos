import base64
import configparser

def almacenarArchivo(base64Str, fileName, filePath):
    try:
        contenido = base64Str.split(",")[1]
        with open(filePath, "w+") as f:
            contenido = base64.b64decode(contenido)
            f.write(contenido.decode("utf-8"))
    except Exception as e:
        print(str(e))

def getTenant(request):
    tenant = request.headers.get("Tenant")
    if (tenant is None):
        tenant=""
    return tenant

def getConfigurations(tenant):
    config = configparser.ConfigParser()
    locationFile='./config/'+tenant+'_config.ini'
    config.read(locationFile)
    print("reading configuration from "+locationFile)
    return config