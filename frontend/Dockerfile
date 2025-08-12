FROM node:22

WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Set environment variable (can be overridden in compose)
ENV VITE_API_URL=http://backend:5000

# Expose the correct port (3000 for Vite)
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]