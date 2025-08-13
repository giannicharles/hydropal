# HydroPal
## Docker Cheat Sheet
### Build Image & Start Stack
```
docker compose up -d
```
### Recreate Image During Active Stack
```
docker compose down; docker compose up -d
```
### View Running Containers
```
docker ps
```
### SSH Into Specific Container
```
docker exec -it <container name> /bin/bash
```
### View Specific Container Logs
```
docker logs <container name>
```
## Environment(.env) File Creation
### Frontend
```
VITE_API_URL=http://localhost:5000
```
### Backend
```
MONGO_URI=mongodb://mongodb:27017/hydropal-db
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```