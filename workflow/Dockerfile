FROM tomcat:9.0.34-jdk14-openjdk-oracle

WORKDIR /usr/src/app

#CMD [ "cd","authenticacion"]

COPY ./warms /usr/local/tomcat/webapps

CMD ["sh","-c","catalina.sh run"]
EXPOSE 8888
