FROM node:20-alpine

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN mkdir -p uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5001/api/health || exit 1

CMD ["node", "server.js"]
