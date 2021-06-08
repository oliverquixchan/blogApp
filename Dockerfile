FROM node:14.16-alpine

EXPOSE 3003

WORKDIR /usr/src/app

COPY . . 

RUN npm install --only=prod && \
    adduser --disabled-password appuser

USER appuser 

CMD npm run start-prod