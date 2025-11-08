FROM node:22-alpine

# Install bash
RUN apk add --no-cache bash

WORKDIR /app

# Copy package*.json into container
COPY ./package*.json ./

RUN npm install

CMD ["bash"]

