# Deployment Guide

## Local Development

### Prerequisites

- Node.js 20+
- Docker and Docker Compose (optional)
- PostgreSQL (if not using Docker)

### Step-by-step Setup

**1. Clone and Setup**
```bash
git clone <repository-url>
cd shopee-price-tracker
```

**2. Database (Docker)**
```bash
docker-compose up -d db
```

**3. Backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your settings
npm install
npm run dev
```

**4. Frontend**
```bash
cd frontend
npm install
npm start
```

**5. Verify**
```bash
curl http://localhost:3000/health
```

## Telegram Bot Setup

1. Create bot via [@BotFather](https://t.me/botfather)
2. Get bot token
3. Add to `.env`: `TELEGRAM_BOT_TOKEN=your_token`
4. (Production) Set webhook:
```bash
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://yourdomain.com/webhook/telegram&secret_token=your_secret"
```

## Production Deployment

### Option 1: Docker Compose

```bash
# Set production environment variables
NODE_ENV=production docker-compose up -d
```

### Option 2: Separate Deployment

**Backend:**
- Railway, Render, Fly.io, or VPS
- Use managed PostgreSQL
- Set environment variables
- Docker: `docker build . && docker run`

**Frontend:**
- Vercel, Netlify, Cloudflare Pages, or VPS
- Build: `npm run build`
- Set API URL environment variable

**Database:**
- Managed PostgreSQL (recommended)
- OR self-hosted on VPS

## Environment Checklist

- [ ] DATABASE_URL configured
- [ ] JWT secrets set (unique, secure)
- [ ] TELEGRAM_BOT_TOKEN set
- [ ] NODE_ENV=production (production)
- [ ] CORS CLIENT_URL set (production)
- [ ] HTTPS enabled (production)

## Monitoring

- Use `/health` endpoint
- UptimeRobot / Better Stack for uptime
- Sentry for error tracking

## Scaling

For high traffic:
- Redis + BullMQ for job queue
- Separate worker service
- Connection pooling
- Caching
