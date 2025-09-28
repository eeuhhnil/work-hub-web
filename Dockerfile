# Stage 1: build React app
FROM node:20-alpine as build
WORKDIR /app

# Copy package & install deps
COPY package.json package-lock.json* yarn.lock* ./
RUN npm install --legacy-peer-deps

# Copy all source & build
COPY . .
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
