FROM python:3.8

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app
#CMD [ "cd","administration"]
#CMD [ "ls"]
CMD ["sh","-c","cd administration &&  ls &&  python Administration.py"]
EXPOSE 5001