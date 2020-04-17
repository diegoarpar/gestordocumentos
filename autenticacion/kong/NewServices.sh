#!bin/bash
curl -i -X POST \
  --url http://127.0.0.1:8001/services/ \
  --data 'name=helloworld6' \
  --data 'url=http://authenticationgestor:5000/helloworld'

curl -i -X POST \
  --url http://127.0.0.1:8001/services/helloworld6/routes \
  -d {"hosts":["192.168.0.16"]}
