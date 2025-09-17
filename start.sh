#!/bin/sh
echo "Starting ZappyTasks application..."
echo "Frontend will be served at: http://localhost"
echo "Backend API will be available at: http://localhost/api"
supervisord -c /etc/supervisor/conf.d/supervisord.conf