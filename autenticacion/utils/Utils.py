from flask import Blueprint
import sys
sys.path.append('../')


def getTenant(request):
    tenant = request.headers.get("Tenant")
    if (tenant is None):
        tenant=""
    return tenant

def getConfigurations(request):
    tenant = request.headers.get("Tenant")
    if (tenant is None):
        tenant=""
    return tenant