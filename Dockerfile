# Stage 1: Build with Maven
FROM maven:3.9.4-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy the entire project (parent + modules)
COPY . .

# Build the specific module
RUN mvn clean install -pl core -am -DskipTests

# Stage 2: Run with lightweight JDK
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/core/target/buildcostmanager-core.jar app.jar

EXPOSE 2025

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
