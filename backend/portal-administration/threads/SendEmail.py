import sys
sys.path.append('../')
from utils import Utils as utils
from threading import Thread
from time import sleep
from db import Db
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from bson.objectid import ObjectId

def SendAnEmail(args):
    app=args["app"]
    tenant = args["tenant"]

    while True:
        with app.app_context():
            emailsStr = Db.findMultiple("email",{"sent":None},tenant)
            emails = json.loads(emailsStr)
            try:
                if len(emails)==0:
                    break
                for email in emails:
                    data = email["data"]
                    variables=email["variables"]
                    for variable in variables:
                        if variable["name"] == "EMAIL_SERVER":
                            emailServer=variable["value"]
                        elif variable["name"] == "EMAIL_TO":
                            to = variable["value"]
                        elif variable["name"] == "EMAIL_TEMPLATE":
                            template = variable["value"]
                    serverStr= Db.find("emailConfiguration",{"TYPE":"SERVER", "name": emailServer},tenant)
                    server=json.loads(serverStr)
                    templateStr = Db.find("emailConfiguration", {"TYPE": "TEMPLATE", "name": template}, tenant)
                    t=json.loads(templateStr)
                    content=t["template"]
                    subject=t["subject"]
                    for value in data:
                        content=content.replace("$"+value,data[value])
                        subject = subject.replace("$" + value, data[value])
                    if (to=="SOLICITANTE"):
                        to=email["processInstanceInformation"]["requester"]["email"]
                    s = smtplib.SMTP(host=server["server"], port=server["port"])
                    s.starttls()
                    s.login(server["user"], server["password"])
                    msg = MIMEMultipart()
                    message = content
                    msg['From'] = server["email"]
                    msg['To'] = to
                    msg['Subject'] = subject
                    msg.attach(MIMEText(message, 'plain'))
                    s.send_message(msg)
                    del msg
                    Db.update("email",{"_id":ObjectId(email["_id"]["$oid"])},{"sent":True, "dateSent":datetime.now().strftime("%m/%d/%Y, %H:%M:%S")},tenant)
                    print("email sent")
            except :
                print ("error enviando un correo" + emailsStr)

        sleep(20)

def initThread(tenant, app):
    with app.app_context():
        thread = Thread(target=SendAnEmail, args=({"tenant":tenant, "app":app},))
        thread.start()