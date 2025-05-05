FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate
RUN pnpm install --no-strict-peer-dependencies
COPY . .

CMD ["pnpm", "start:dev"]
