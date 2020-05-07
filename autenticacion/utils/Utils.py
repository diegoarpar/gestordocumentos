import configparser
import sys
sys.path.append('../')


def getTenant(request):
    tenant = request.headers.get("Tenant")
    if (tenant is None):
        tenant=""
    return tenant

def getConfigurations(tenant):
    config = configparser.ConfigParser()
    locationFile='../config/'+tenant+'_configAutentication.ini'
    config.read(locationFile)
    print("reading configuration from "+locationFile)
    return config