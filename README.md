# Hydropal
## Docker Container Setup
### Build Image & Start Services
```
docker compose up -d
```
## Environment(.env) File Creation
### Frontend
```
VITE_API_URL=http://localhost:5000
```
### Backend
MONGO_URI=mongodb://mongodb:27017/hydropal-db
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development