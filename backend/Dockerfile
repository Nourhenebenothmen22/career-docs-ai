# Stage 1: Install production dependencies only
FROM node:20.14.0-slim AS dependencies
WORKDIR /app
COPY package*.json ./
# Run npm ci with --ignore-scripts to prevent the puppeteer postinstall script from downloading Chrome.
# Install all dependencies (including devDependencies like pino-pretty) to support local development mode.
RUN npm ci --ignore-scripts && npm cache clean --force

# Stage 2: Final runner image
FROM ghcr.io/puppeteer/puppeteer:22.11.2 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Switch to root to safely install fonts/ca-certificates on Debian base image
USER root

# Remove Google Chrome APT repository configurations to avoid GPG signature errors,
# since Chrome is already pre-installed in the base image.
RUN rm -f /etc/apt/sources.list.d/google*.list && \
    apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

# Switch back to the non-root pptruser provided by the base image
USER pptruser

# Copy built node_modules and files, ensuring correct non-root ownership
COPY --chown=pptruser:pptruser --from=dependencies /app/node_modules ./node_modules
COPY --chown=pptruser:pptruser package.json ./
COPY --chown=pptruser:pptruser src/ ./src/

EXPOSE 5000
CMD ["node", "src/index.js"]
