import base64
import configparser
import os
import errno

def almacenarArchivo(base64Str, fileName, filePath):
    if not os.path.exists(os.path.dirname(filePath)):
        try:
            os.makedirs(os.path.dirname(filePath))
        except OSError as exc:  # Guard against race condition
            if exc.errno != errno.EEXIST:
                raise
    try:
        with open(filePath, "wb") as f:
            f.write(base64.b64decode(base64Str.split(",")[1]))
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