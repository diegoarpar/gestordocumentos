#!bin/bash
curl -i -X POST \
  --url http://127.0.0.1:5000/kongkong/registerservice/ \
  -d {"servicename":   "helloworld22","url":"http://authenticationgestor:5000/helloworld",
      "consumerhosts":["192.168.0.16"],
      "gatewaypaths":["/helloworld22"],
      "methods":["GET"],"scopes":["FN"]}