# starting point: an image of node-12
FROM node:12.22.11

# create the app directory inside the image
RUN mkdir -p /usr/src/app && cd /usr/src/app
WORKDIR /usr/src/app

# install app dependencies from the files package.json and package-lock.json
# installing before transfering the app files allows us to take advantage of cached Docker layers
COPY package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# transfer all the app files to the working directory
COPY ./ ./

# build the app
RUN npm run build

# expose the required port
EXPOSE 80

# install nginx
RUN apt-get update && apt-get install -y nano supervisor nginx
COPY frontend.conf /etc/nginx/conf.d/frontend.conf
ADD /supervisor /src/supervisor

# Initializing nginx and node app from supervisord
CMD ["supervisord","-c","/src/supervisor/service_script.conf"]
