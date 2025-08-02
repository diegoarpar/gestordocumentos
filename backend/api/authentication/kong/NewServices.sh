#!bin/bash
curl -i -X POST \
  --url http://127.0.0.1:5000/kongkong/registerserviceoauth/ \
  -H "Content-Type: application/json" \
  -d '{"servicename":  "helloworld1","url":"http://authenticationgestor:5000/helloworld",
      "consumerhosts":["192.168.0.16","127.0.0.1","kong"],
      "gatewaypaths":["/helloworld1"],
      "methods":["GET"],"scopes":["FN"],
      "origins":["*"]
      }'

curl -i -X POST \
  --url http://127.0.0.1:5000/kongkong/registerservice/ \
  -H "Content-Type: application/json" \
  -d '{"servicename": "validateuser",
      "url":"http://authenticationgestor:5000/authentication/validateuser/",
      "consumerhosts":["192.168.0.16","127.0.0.1","kong"],
      "gatewaypaths":["/authentication/validateuser/"],
      "methods":["POST"],"scopes":["FN"],
      "origins":["*"]
      }'