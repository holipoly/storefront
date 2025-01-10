FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Get PNPM version from package.json
RUN export PNPM_VERSION=$(cat package.json | jq '.engines.pnpm' | sed -E 's/[^0-9.]//g')

COPY package.json pnpm-lock.yaml ./
RUN yarn global add pnpm@$PNPM_VERSION
RUN pnpm i --frozen-lockfile --prefer-offline

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

ENV NEXT_OUTPUT=standalone
ARG NEXT_PUBLIC_HOLIPOLY_API_URL
ENV NEXT_PUBLIC_HOLIPOLY_API_URL=${NEXT_PUBLIC_HOLIPOLY_API_URL}
ARG NEXT_PUBLIC_STOREFRONT_URL
ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}

# Get PNPM version from package.json
RUN export PNPM_VERSION=$(cat package.json | jq '.engines.pnpm' | sed -E 's/[^0-9.]//g')
RUN yarn global add pnpm@$PNPM_VERSION

RUN pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_HOLIPOLY_API_URL
ENV NEXT_PUBLIC_HOLIPOLY_API_URL=${NEXT_PUBLIC_HOLIPOLY_API_URL}
ARG NEXT_PUBLIC_STOREFRONT_URL
ENV NEXT_PUBLIC_STOREFRONT_URL=${NEXT_PUBLIC_STOREFRONT_URL}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs


CMD ["node", "server.js"]
