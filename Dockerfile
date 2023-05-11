# Use the official Node.js image as the base image
FROM node:alpine

# Set the working directory to /app
WORKDIR /app

COPY ./index.js .

# Set the environment variables
ENV DEBUG=${DEBUG:-false} TOKENS=${TOKENS} CITIES=${CITIES} SECONDS=${SECONDS} DEMO=${DEMO:-false}

# Expose port 3131
EXPOSE 3131

# Start the application
CMD ["node", "index.js"]