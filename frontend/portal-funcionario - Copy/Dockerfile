FROM node:14.2
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build && npm install -g serve
EXPOSE 5000
#CMD [ "npm", "start" ]
CMD [ "serve", "-s","build" ]
