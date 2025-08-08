FROM node:22

WORKDIR /home/node/app

COPY ./ /home/node/app

# Install dependencies
RUN npm install

# Final configuration
EXPOSE 3000
EXPOSE 5000
EXPOSE 5173
EXPOSE 27017
CMD ["npm", "run", "dev", "--", "--host"]