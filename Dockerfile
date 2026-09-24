# Stage 1: Build Backend
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=builder /app/dist ./dist
# If you have static assets in public folder
COPY --from=builder /app/public ./public 
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
