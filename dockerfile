FROM node:18.14.0-bullseye
WORKDIR /myapp
COPY . ./
COPY package.json /myapp/package.json
COPY yarn.lock /myapp/yarn.lock
RUN apt update \
    && npm install
EXPOSE 5173

CMD ["npm", "run", "dev"]
