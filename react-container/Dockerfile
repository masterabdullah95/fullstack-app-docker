# Build stage
FROM oven/bun:1 AS build
WORKDIR /app

# Declare build argument
ARG VITE_API_URL
# Make it available to Vite during build
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json bun.lock ./
RUN bun install 
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1
WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["bunx", "serve", "-s", "dist", "-l", "5173"]