# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Instalar dependências apenas quando necessário
FROM base AS deps
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilitar telemetry durante build
ENV NEXT_TELEMETRY_DISABLED 1

# Build da aplicação
RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do build
COPY --from=builder /app/public ./public

# Copiar arquivos de build otimizados
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]