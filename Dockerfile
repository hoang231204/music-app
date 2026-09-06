# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests and tsconfig
COPY package*.json tsconfig.json ./

# Install all dependencies (including devDependencies required for compilation)
RUN npm ci

# Copy source code and static assets
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package manifests and install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Copy runtime template views and public assets
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public

# Use unprivileged node user for security
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "dist/index.js"]
