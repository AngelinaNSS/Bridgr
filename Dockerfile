FROM node:18-alpine

RUN apk add --no-cache nginx

WORKDIR /app

COPY backend/package*.json ./
RUN npm install
COPY backend/server.js .

COPY app /usr/share/nginx/html

COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 3000

CMD sh -c "nginx && cd /app && node server.js"
