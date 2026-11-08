FROM node:20-alpine

WORKDIR /app

# Copy package files first so Docker caches the npm install layer
COPY package*.json ./
RUN npm install --omit=dev

# Then copy the rest of the code
COPY backend/ ./

EXPOSE 3000

CMD ["node", "backend.js"]