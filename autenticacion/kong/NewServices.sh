#!bin/bash
curl -i -X POST \
  --url http://127.0.0.1:5000/kongkong/registerserviceoauth/ \
  -H "Content-Type: application/json" \
  -d '{"servicename":  "helloworld22","url":"http://authenticationgestor:5000/helloworld",
      "consumerhosts":["192.168.0.16"],
      "gatewaypaths":["/helloworld22"],
      "methods":["GET"],"scopes":["FN"]
      }'

curl -i -X POST \
  --url http://127.0.0.1:5000/kongkong/registerservice/ \
  -H "Content-Type: application/json" \
  -d '{"servicename": "validateuser",
      "url":"http://authenticationgestor:5000/authentication/validateuser/",
      "consumerhosts":["192.168.0.16"],
      "gatewaypaths":["/authentication/validateuser/"],
      "methods":["POST"],"scopes":["FN"]
      }'