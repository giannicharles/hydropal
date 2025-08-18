# HydroPal

A comprehensive water management application built with modern web technologies.

## 🚀 Quick Start

Follow these steps to get HydroPal running on your Windows machine using Docker.

## 📋 Prerequisites

- Windows 10 (version 2004 or higher) or Windows 11
- Administrator privileges for initial setup
- At least 4GB RAM available for Docker

## 🛠️ Setup Guide - Windows PowerShell

### 1. Install WSL
Run PowerShell as Administrator and execute:
```powershell
wsl --install
```

> [!NOTE]
> If WSL is already installed, update it instead:
> ```powershell
> wsl --update
> ```
> You will be prompted to restart your PC after installation.

### 2. Install Docker Desktop
```powershell
winget install --id Docker.DockerDesktop -e --source winget
```

> [!IMPORTANT]
> After installation:
> - Restart your computer
> - Launch Docker Desktop from the Start menu
> - Ensure Docker Desktop is running (check system tray)
> - Enable WSL 2 integration in Docker settings

### 3. Install Git
```powershell
winget install --id Git.Git -e --source winget
```

> [!TIP]
> Restart PowerShell after installation to refresh the PATH.

### 4. Clone the Repository
```powershell
git clone https://github.com/giannicharles/hydropal.git
```

> [!NOTE]
> This will create a `hydropal` folder in your current directory. Use `cd` to navigate to your preferred location first if needed.

### 5. Navigate to Project Directory
```powershell
cd hydropal
```

### 6. Create Environment Files
Create the required `.env` files for both frontend and backend:

**Frontend environment file:**
1. Create a new file: `frontend/.env`
2. Add this content:
```
VITE_API_URL=http://localhost:5000
```

**Backend environment file:**
1. Create a new file: `backend/.env`  
2. Add this content:
```
MONGO_URI=mongodb://mongodb:27017/hydropal-db
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

> [!IMPORTANT]
> **Security Recommendation:** Change `JWT_SECRET` to a stronger, unique value:
> ```
> JWT_SECRET=hydropal_strong_secret_key_2025_custom
> ```

> [!WARNING]
> Create these files manually using a text editor. PowerShell commands may cause encoding issues that prevent the database from working properly.

> [!NOTE]
> These .env files are excluded from version control via `.gitignore` to protect configuration data.

### 7. Build and Start the Application
```powershell
docker compose up -d
```

> [!NOTE]
> Initial build may take several minutes. Once complete:
> - **Frontend**: [http://localhost:3000](http://localhost:3000)
> - **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

## 🐳 Docker Commands Reference

### Basic Operations
| Command | Description |
|---------|-------------|
| `docker compose up -d` | Build images and start all services in background |
| `docker compose down` | Stop and remove all containers |
| `docker compose restart` | Restart all services |
| `docker compose logs` | View logs from all services |

### Development Commands
```powershell
# Rebuild and restart (useful during development)
docker compose down && docker compose up -d --build

# View running containers
docker ps

# View all containers (including stopped)
docker ps -a
```

### Container Management
```powershell
# Access container shell
docker exec -it <container_name> /bin/bash

# View specific container logs
docker logs <container_name> -f

# View container resource usage
docker stats
```

### Database Operations
```powershell
# Connect to MongoDB
docker exec -it hydropal-mongodb-1 mongosh

# Inside MongoDB shell
use hydropal-db
show collections
db.<collection_name>.find().pretty()
```

## 🔧 Troubleshooting

### Common Issues

**Docker not starting:**
- Ensure WSL 2 is properly installed
- Check if virtualization is enabled in BIOS
- Restart Docker Desktop service

**Port conflicts:**
- Check if ports 3000 or 5000 are already in use
- Modify port mappings in `docker-compose.yml` if needed

**Permission errors:**
- Run PowerShell as Administrator
- Ensure Docker Desktop has proper permissions

### Getting Help
```powershell
# Check Docker version
docker --version

# Check running services
docker compose ps

# View system information
docker system info
```

## 📁 Project Structure
```
hydropal/
├── docker-compose.yml
├── frontend/
├── backend/
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.