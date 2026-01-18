FROM oven/bun:1.1-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run migrations and start server
CMD bun run db:push && bun run dev