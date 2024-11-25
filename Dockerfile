# Use Node.js 18 as the build stage
FROM node:18 as build-stage

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY ./package.json ./package-lock.json ./
RUN npm install

# Copy the rest of the app files and build the Angular app
COPY ./ ./
RUN npm run build --prod

# Use Nginx as the production server
FROM nginx:alpine as production-stage

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files to Nginx web directory
COPY --from=build-stage /app/dist/lab4-v3 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
