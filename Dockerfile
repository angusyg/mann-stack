FROM node:alpine

USER node

# Install pm2
RUN npm install pm2 -g

# Install pm2 log rotate and configure it
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:max_size 10M
RUN pm2 set pm2-logrotate:retain 10
RUN pm2 set pm2-logrotate:compress true
RUN pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
RUN pm2 set pm2-logrotate:rotateModule true
RUN pm2 set pm2-logrotate:workerInterval 30
RUN pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

# Create app client directory
WORKDIR /usr/src/app/client

# Install client app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY client/package*.json .

# Install client app
RUN npm install

# Bundle client source
COPY client .

# Build and clean client
RUN npm run build
RUN npm prune --production

# Create app server directory
WORKDIR /usr/src/app/server

# Install client server dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY server/package*.json .

# Install server app
RUN npm install

# Bundle server source
COPY server .

# Build and clean server
RUN npm run build
RUN npm prune --production

# Change directory to app root
WORKDIR /usr/src/app

# Bundle pm2 app file
COPY ecosystem.config.js .

# Set envrionment variables
ENV NODE_ENV production
ENV PORT 3000
ENV DB_URL mongo:27017
ENV DB_NAME mann

# Expose app port
EXPOSE ${PORT}

# Monitor app with pm2
CMD ["pm2-runtime", "--json", "start", "ecosystem.config.js"]