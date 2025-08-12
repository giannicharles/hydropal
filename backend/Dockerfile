FROM node:22

WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Set environment variables
ENV MONGO_URI=mongodb://mongodb:27017/hydropal-db
ENV PORT=5000

# Expose the port my application uses
EXPOSE 5000

# Use nodemon for development with proper host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]