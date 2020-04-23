FROM node:10
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

COPY . .
RUN rpm run build && npm install -g serve
EXPOSE 5000
#CMD [ "npm", "start" ]
CMD [ "serve", "-s","build" ]
