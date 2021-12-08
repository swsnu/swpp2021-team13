FROM node:16

WORKDIR /usr/app

COPY package.json .
COPY tsconfig.json .
COPY yarn.lock .
COPY src/ src/
COPY public/ public/
COPY build/ build/
# RUN yarn install
# RUN yarn build

RUN apt update && apt install -y nginx
COPY nginx.conf /etc/nginx/sites-enabled/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/nginx.conf
RUN mkdir -p /usr/share/nginx/html
RUN cp -r build/* /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]

