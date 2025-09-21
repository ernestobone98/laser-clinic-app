# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Install envsubst (for variable substitution)
RUN apk add --no-cache gettext

# Set default environment variables (can be overridden at runtime)
ENV SERVER_NAME=localhost
ENV PROXY_PASS=http://localhost:8080

# Copy the built app from the build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf /tmp/nginx.conf

# Create a startup script to substitute variables at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'envsubst "${SERVER_NAME} ${PROXY_PASS}" < /tmp/nginx.conf > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
