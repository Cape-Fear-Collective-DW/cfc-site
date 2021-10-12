# starting point: an image of node-12
FROM node:12-alpine

# create the app directory inside the image
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
EXPOSE 3300

# start the app on image startup
CMD ["npm", "run", "start"]
