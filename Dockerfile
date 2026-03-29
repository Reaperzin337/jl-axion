FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
ENV npm_config_build_from_source=true
RUN npm ci --omit=dev --build-from-source \
  && npm rebuild sqlite3 --build-from-source

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1))"

CMD ["node", "server.js"]
