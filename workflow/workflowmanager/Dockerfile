FROM maven:3.3-jdk-8

WORKDIR /usr/src/mymaven

#CMD [ "cd","authenticacion"]

COPY . .
RUN mvn -B -f pom.xml dependency:resolve

#CMD ["sh","-c","service start"]
#CMD ["java -Dfile.encoding=utf-8 -Xmx2048m -jar target/workflowmanager-1.0-SNAPSHOT.jar"]
EXPOSE 2001
