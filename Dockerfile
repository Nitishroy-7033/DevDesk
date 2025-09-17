# Multi-stage build for ZappyTasks (Frontend + Backend)
FROM node:18-alpine AS frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY Client/package*.json ./

# Install frontend dependencies (ignore bun.lockb and use npm for Docker compatibility)
RUN npm install

# Copy frontend source code
COPY Client/ ./

# Build frontend for production
RUN npm run build

# Backend build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build

# Set working directory for backend
WORKDIR /app/backend

# Copy backend project files
COPY Server/TaskManager/*.csproj ./
RUN dotnet restore

# Copy backend source code
COPY Server/TaskManager/ ./

# Publish backend
RUN dotnet publish -c Release -o out

# Final stage - Runtime with Nginx
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

# Create directories
RUN mkdir -p /var/log/supervisor \
    && mkdir -p /var/log/nginx \
    && mkdir -p /var/www/html \
    && mkdir -p /app/backend \
    && mkdir -p /etc/supervisor/conf.d

# Copy built frontend from frontend-build stage
COPY --from=frontend-build /app/frontend/dist /var/www/html

# Copy built backend from backend-build stage
COPY --from=backend-build /app/backend/out /app/backend

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80 for nginx
EXPOSE 80

# Set environment variables for .NET
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://localhost:5175

# Start both services using supervisor
CMD ["/start.sh"]