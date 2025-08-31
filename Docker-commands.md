# Docker Commands for BCM Backend

This document contains useful Docker commands for building, pushing, and managing the BCM backend application.

---

## Build and Push Docker Images

- **Build the Docker image and tag it as latest:**
  ```sh
  docker build -t iyadmosa/bcm-backend-image:latest .
  ```
- **Push the latest image to Docker Hub:**
  ```sh
  docker push iyadmosa/bcm-backend-image:latest
  ```
- **Pull the latest image from Docker Hub:**
  ```sh
  docker pull iyadmosa/bcm-backend-image:latest
  ```

---
## Docker Network

- **Create a Docker network for the backend:**
  ```sh
  docker network create bcm-net
  ```

---
## Run Containers

- **Run the backend container with port mapping:**
  ```sh
  docker run -d --name bcm-backend -p 2025:2025 iyadmosa/bcm-backend-image:latest
  ```
- **Run the backend container with port mapping and network:**
  ```sh
  docker run -d --name bcm-backend --network bcm-network -p 2025:2025 iyadmosa/bcm-backend-image:latest
  ```
- **Run a container instance with remote debugging enabled on port 5005:**
  ```sh
  docker run -d --name bcm-debug-1 --network bcm-net -p 2025:2025 -p 5005:5005 --entrypoint "" iyadmosa/bcm:latest java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar /app/app.jar
  ```

---
## Logs and Cleanup

- **View container logs:**
  ```sh
  docker logs bcm-backend
  ```
- **Stop and remove the container:**
  ```sh
  docker stop bcm-backend && docker rm bcm-backend
  ```
- **Remove the Docker image:**
  ```sh
  docker rmi iyadmosa/bcm-backend-image:latest
  ```

---

> **Note:** Replace container and image names as needed for your environment.

