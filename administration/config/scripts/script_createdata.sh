#!bin/bash
curl -i -X PUT \
  --url http://127.0.0.1:5001/administration/parametricvalue/ \
  -H "Content-Type: application/json" \
  -d '{"description":  "AAAAMMDDHHMMSSmmm",
      "name": "%Y%m%d%H%M%S%f",
      "type": "REQUEST_NUMBER_PATTERN",
      "typeDescription": "Patrón radicado",
      "value": "%Y%m%d%H%M%S%f"
      }'

curl -i -X PUT \
  --url http://127.0.0.1:5001/administration/parametricvalue/ \
  -H "Content-Type: application/json" \
  -d '{"description":  "AAAA/MM/DD/HHMMSSmmm",
      "name": "%Y/%m/%d %H%M%S%f",
      "type": "REQUEST_NUMBER_PATTERN",
      "typeDescription": "Patrón radicado",
      "value": "%Y%m%d%H%M%S%f"
      }'

curl -i -X PUT \
  --url http://127.0.0.1:5001/administration/parametricvalue/ \
  -H "Content-Type: application/json" \
  -d '{"description":  "DD/MM/AAAA/HHMMSSmmm",
      "name": "%d/%m/%Y %H%M%S%f",
      "type": "REQUEST_NUMBER_PATTERN",
      "typeDescription": "Patrón radicado",
      "value": "%d%m%Y%H%M%S%f"
      }'


curl -i -X PUT \
  --url http://127.0.0.1:5001/administration/parametricvalue/ \
  -H "Content-Type: application/json" \
  -d '{"description":  "DD/MM/AAAA/HHMMSSmmm",
      "name": "%d%m%Y %H%M%S%f",
      "type": "REQUEST_NUMBER_PATTERN",
      "typeDescription": "Patrón radicado",
      "value": "%d%m%Y%H%M%S%f"
      }'