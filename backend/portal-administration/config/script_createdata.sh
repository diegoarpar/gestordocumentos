#!bin/bash
curl -i -X PUT \
  --url http://127.0.0.1:5001/administration/parametricvalue/ \
  -H "Content-Type: application/json" \
  -H "Tenant: gestorbancoa" \
  -d '{"description":  "dd/MM/yyyy HH:mm:ss",
      "name": "dd/MM/yyyy HH:mm:ss",
      "type": "REQUEST_NUMBER_PATTERN",
      "typeDescription": "Patrón radicado",
      "value": "ddMMyyyyHHmmss"
      }'

curl -i -X PUT \
  --url http://127.0.0.1:5001/administration/parametricvalue/ \
  -H "Content-Type: application/json" \
  -H "Tenant: gestorbancoa" \
  -d '{"description":  "dd/MM/yyyy HH:mm:ss.SSS",
      "name": "dd/MM/yyyy HH:mm:ss.SSS",
      "type": "REQUEST_NUMBER_PATTERN",
      "typeDescription": "Patrón radicado",
      "value": "ddMMyyyyHHmmssSSS"
      }'

curl -i -X PUT \
  --url http://127.0.0.1:5001/administration/parametricvalue/ \
  -H "Content-Type: application/json" \
  -H "Tenant: gestorbancoa" \
  -d '{"description":  "yyyy/MM/dd HH:mm:ss.SSS",
      "name": "yyyy/MM/dd HH:mm:ss.SSS",
      "type": "REQUEST_NUMBER_PATTERN",
      "typeDescription": "Patrón radicado",
      "value": "yyyyMMddHHmmssSSS"
      }'


curl -i -X PUT \
  --url http://127.0.0.1:5001/administration/parametricvalue/ \
  -H "Content-Type: application/json" \
  -H "Tenant: gestorbancoa" \
  -d '{"description":  "yyyy/MM/dd HH:mm:ss",
      "name": "yyyy/MM/dd HH:mm:ss",
      "type": "REQUEST_NUMBER_PATTERN",
      "typeDescription": "Patrón radicado",
      "value": "yyyyMMddHHmmss"
      }'