# starting point: an image of node-16
FROM node:16

# Create a new group called 'allusers'
RUN addgroup allusers

# Create a new user 'nodejs' and add it to the 'allusers' group
RUN adduser --disabled-password --gecos "" --ingroup allusers nodejs

# install mysql
RUN apt-get update
RUN apt-get install \
  default-mysql-client \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils -y

# create the app directory inside the image
WORKDIR /usr/src/app

# install app dependencies from the files package.json and package-lock.json
# installing before transfering the app files allows us to take advantage of cached Docker layers
COPY package*.json ./

RUN npm ci

# If you are building your code for production
# RUN npm ci --only=production

# transfer all the app files to the working directory
COPY ./ ./

# build the app
RUN npm run build

# expose the required port
EXPOSE 3300

# Set the user to 'nodejs' for subsequent commands
USER nodejs

# Set Node Max Old Space Size
ENV NODE_OPTIONS=--max_old_space_size=3200

# start the app on image startup
CMD ["npm", "run", "start"]
