#!bin/bash
#new User
curl -i -X POST \
  --url http://127.0.0.1:5000/authentication/createuser/ \
  -H 'Content-Type: application/json'\
  -H 'Tenant:gestorbancoa' \
  -d '{"documentNumber":  "1098",
      "documentType":"CC",
      "email":"DIEGOAPAR@GMAIL.COM",
      "password":"8c736c5b4c502633728abdbe4a8b898878462c8c1f837c61f0c4cd8d84d697c9",
      "user":"diego5"
      }'

#create tenant
curl -i -X PUT \
  --url http://127.0.0.1:5000/authentication/tenant/ \
  -H 'Content-Type: application/json'\
  -d '{"tenant": "gestorbancoa",
      "url":"localhost"
      }'