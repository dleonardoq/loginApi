FROM node:20

RUN npm i -g pnpm

RUN mkdir -p /var/www/html/loginApp

COPY package*.json /var/www/html/loginApp

RUN pnpm install

COPY . /var/www/html/loginApp

EXPOSE 3000

CMD ["node", "/var/www/html/loginApp/app.js"]