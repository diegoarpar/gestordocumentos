FROM python:3.8

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . /usr/src/app

CMD ["sh","-c","flask run -h 0.0.0.0"]
EXPOSE 5000
