FROM node:22

WORKDIR /usr/src/app

# Copy files needed to run the application
COPY . /usr/src/app

# Install dependencies
RUN npm install

# Final configuration
EXPOSE 3000
EXPOSE 27017
CMD ["npm", "run", "dev", "--", "--host"]