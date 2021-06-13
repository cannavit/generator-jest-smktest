FROM arm64v8/node:14.4.0-alpine

WORKDIR /usr/src/app

RUN npm install
RUN apk update
RUN apk add curl

COPY . /usr/src/app/

RUN npm link


