# Stage 1: Build Frontend and Dependencies
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install build tools for native compilation (better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    sqlite3 \
 && rm -rf /var/lib/apt/lists/*

# Copy package definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build React application (dist/)
RUN npm run build

# Stage 2: Production Runner
FROM node:20-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    sqlite3 \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3001

# Copy production artifacts
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Expose the application port
EXPOSE 3001

# Start full-stack server
CMD ["npm", "start"]
