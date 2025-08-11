# Hydropal
## Frontend
### Build
```
docker build -t hydropal-frontend:latest .
```
### Run
```
docker run -p 127.0.0.1:3000:3000 hydropal-frontend:latest
```

## Backend
### Build
```
docker build -t hydropal-backend:latest .
```
### Run
```
docker run -p 127.0.0.1:5000:5000 hydropal-backend:latest
```

## Database
### BuildS
```
docker pull mongo:latest
```
### Run
```
docker run -d -p 127.0.0.1:27017:27017 --name hydropal-db -v ./:/data/db mongo:latest
```

## Docker
### Compose
```
docker compose up -d
```