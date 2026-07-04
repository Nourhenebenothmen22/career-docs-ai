FROM node:20-alpine AS base
WORKDIR /app

# Install chromium dependencies for Puppeteer A4 generation
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

EXPOSE 5000
CMD ["npm", "start"]
