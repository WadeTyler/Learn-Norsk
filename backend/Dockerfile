# Stage 1 - Build the Maven project
FROM maven:3.8.7-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the project's pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the project source code
COPY src src/
RUN mvn clean package -DskipTests

# Stage 2 - Create the final image
FROM eclipse-temurin:17
WORKDIR /app

# Copy the compiled JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application's port (change 8080 if needed)
EXPOSE 8080

# Run the JAR
CMD ["java", "-jar", "app.jar"]