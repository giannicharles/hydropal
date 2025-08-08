FROM node:22

WORKDIR /home/node/app

COPY ./ /home/node/app

# Install dependencies
RUN npm install

# Final configuration
EXPOSE 5173
EXPOSE 3000
CMD ["npm", "start", "--", "--host"]