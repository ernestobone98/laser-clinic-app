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

# Copy the built app from the build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration and substitute variables
COPY nginx.conf /tmp/nginx.conf
RUN envsubst '${SERVER_NAME} ${PROXY_PASS}' < /tmp/nginx.conf > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
