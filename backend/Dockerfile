FROM node:20-alpine

WORKDIR /app

# Copy package files first so Docker caches the npm install layer
COPY package*.json ./
RUN npm install

# Then copy the rest of the code
COPY . .

EXPOSE 3000

CMD ["node", "backend.js"]