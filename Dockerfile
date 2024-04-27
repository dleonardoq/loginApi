FROM node:20

RUN mkdir -p /var/www/html/loginApp

RUN npm install -g pnpm

WORKDIR /var/www/html/loginApp

COPY . /var/www/html/loginApp

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "dev"]