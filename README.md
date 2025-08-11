"# Hydropal" 

# Docker Syntax
## Frontend
### Build
* docker build -t hydropal-frontend:latest .
### Run
* docker run -p 127.0.0.1:3000:3000 hydropal-frontend:latest

# Docker Syntax
## Backend
### Build
* docker build -t hydropal-backend:latest .
### Run
* docker run -p 127.0.0.1:5000:5000 hydropal-backend:latest

# Docker Syntax
## Database
### Build
* docker pull mongodb/mongodb-community-server:latest
### Run
* docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest