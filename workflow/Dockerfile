FROM tomcat:jdk8

#WORKDIR /usr/src/app

#CMD [ "cd","authenticacion"]

COPY ./warms /usr/local/tomcat/webapps

CMD ["sh","-c","catalina.sh run"]
EXPOSE 8888
