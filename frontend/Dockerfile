FROM node:22

WORKDIR /usr/src/app

# Copy files needed to run the application
COPY . /usr/src/app

# Install dependencies
RUN npm install

# Final configuration
EXPOSE 5000
CMD ["npm", "start", "--", "--host"]