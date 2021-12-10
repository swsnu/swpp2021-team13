# FROM node:16 AS builder

# WORKDIR /usr/app

# COPY package.json .
# COPY tsconfig.json .
# COPY yarn.lock .
# COPY src/ src/
# COPY public/ public/
# RUN yarn --frozen-lockfile
# RUN yarn build

FROM nginx:1.20

COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder build/* /usr/share/nginx/html/
COPY build/ /usr/share/nginx/html/

EXPOSE 80
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

