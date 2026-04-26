FROM node:current

WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

RUN pnpm drizzle-kit push

EXPOSE 3001
CMD ["node", "--import", "tsx", "src/index.ts"]