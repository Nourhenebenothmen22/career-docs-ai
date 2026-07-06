# Stage 1: Build static assets
FROM node:20.14.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve assets with non-root Nginx
FROM nginxinc/nginx-unprivileged:1.26-alpine
# Copy built static assets with proper non-root ownership
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
