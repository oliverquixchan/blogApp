FROM node:14.16

EXPOSE 3003

WORKDIR /usr/src/app

COPY . . 

RUN npm install --only=prod

CMD npm run start-prod