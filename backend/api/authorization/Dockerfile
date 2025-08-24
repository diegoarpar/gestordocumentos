FROM python:3.8

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app
#CMD [ "cd","authenticacion"]
#CMD [ "ls"]
CMD ["sh","-c","cd authenticacion &&  ls &&  python Authenticacion.py"]
EXPOSE 5000
