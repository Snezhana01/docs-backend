FROM node:18.18

WORKDIR /home/app/

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD yarn start:prod