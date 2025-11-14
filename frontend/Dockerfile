# Use Node to install dependencies and serve the built/static files
## Builder stage: install dependencies
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching for npm install
COPY package.json package-lock.json* ./

# Install dependencies (will populate node_modules)
RUN npm ci --silent || npm install --silent

# Copy application source
COPY . .

## Final stage: lightweight nginx serving the static files
FROM nginx:stable-alpine AS runner

# Remove default nginx static content and copy built files (including node_modules)
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Use default nginx entrypoint to serve files
CMD ["nginx", "-g", "daemon off;"]
