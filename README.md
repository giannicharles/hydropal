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