# Building stage
FROM node:15.10-alpine as build-stage

# Create working catalog
WORKDIR /usr/src/gl-front-vision

# Copy package and package lock
COPY package*.json ./

# Run install deps
RUN npm i

# Copy all files in working catalog
COPY . .

# Build project
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /usr/src/gl-front-vision/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]