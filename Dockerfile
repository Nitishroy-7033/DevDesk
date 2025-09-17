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

# Create supervisor configuration
RUN echo '[supervisord]' > /etc/supervisor/conf.d/supervisord.conf && \
    echo 'nodaemon=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:nginx]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=nginx -g "daemon off;"' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stdout_logfile=/var/log/supervisor/nginx.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stderr_logfile=/var/log/supervisor/nginx.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo '[program:dotnet]' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'command=dotnet /app/backend/TaskManager.dll' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'directory=/app/backend' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stdout_logfile=/var/log/supervisor/dotnet.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'stderr_logfile=/var/log/supervisor/dotnet.log' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'autorestart=true' >> /etc/supervisor/conf.d/supervisord.conf && \
    echo 'environment=ASPNETCORE_ENVIRONMENT=Production,ASPNETCORE_URLS=http://localhost:5175' >> /etc/supervisor/conf.d/supervisord.conf

# Expose port 80 for nginx
EXPOSE 80

# Set environment variables for .NET
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://localhost:5175

# Create a startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "Starting ZappyTasks application..."' >> /start.sh && \
    echo 'echo "Frontend will be served at: http://localhost"' >> /start.sh && \
    echo 'echo "Backend API will be available at: http://localhost/api"' >> /start.sh && \
    echo 'supervisord -c /etc/supervisor/conf.d/supervisord.conf' >> /start.sh && \
    chmod +x /start.sh

# Start both services using supervisor
CMD ["/start.sh"]