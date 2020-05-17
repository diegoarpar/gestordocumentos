FROM maven:3.3-jdk-8 as build

WORKDIR /usr/src/mymaven

COPY . .
RUN mvn -f pom.xml clean package

RUN echo $(pwd)
FROM openjdk:11-jre-slim
WORKDIR /usr/local/lib/
COPY --from=build /usr/src/mymaven/target/workflowmanager-1.0-SNAPSHOT.jar ./workflowmanager.jar
COPY --from=build /usr/src/mymaven/config/config.yml ./config.yml

ENTRYPOINT ["java","-Dfile.encoding=utf-8", "-Xmx2048m", "-jar","workflowmanager.jar","serve","config.yml"]
EXPOSE 2001
