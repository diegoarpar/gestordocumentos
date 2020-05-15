FROM maven:3.3-jdk-8

WORKDIR /usr/src/mymaven

#CMD [ "cd","authenticacion"]

COPY . .
RUN mvn -B -f pom.xml dependency:resolve

#CMD ["sh","-c","service start"]
EXPOSE 2001
