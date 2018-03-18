FROM node:carbon

WORKDIR /app

COPY . .

RUN npm install --silent --depth 0 && npm install -g nodemon

EXPOSE 3000

CMD nodemon app.js
