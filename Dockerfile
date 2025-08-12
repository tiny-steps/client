# Stage 1: Build the Vite React app with Node 24
FROM node:24-alpine AS build

WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Vite default port (5173)
EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
