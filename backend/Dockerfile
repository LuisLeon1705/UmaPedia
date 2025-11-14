FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY package.json ./
RUN npm install --only=production

# Copy application source
COPY . ./

EXPOSE 3000

CMD ["node", "server.js"]
