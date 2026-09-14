# Backend

Backend API service for Shopee Price Tracker.

## Tech Stack

- Node.js + Express
- TypeScript
- Sequelize ORM
- PostgreSQL

## Setup

### Manual

1. `npm install`
2. `cp .env.example .env`
3. Configure environment variables
4. `npm run dev`

### Docker

```bash
docker build -t shopee-backend .
docker run -p 3000:3000 --env-file .env shopee-backend
```

## API

All endpoints use `/api` prefix

See `docs/api-contract.md`

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 3000 | Server port |
| NODE_ENV | No | development | Environment |
| DATABASE_URL | Yes | - | PostgreSQL connection string |
| JWT_ACCESS_SECRET | Yes | - | JWT signing secret |
| JWT_REFRESH_SECRET | Yes | - | JWT refresh secret |
| JWT_ACCESS_EXPIRES_IN | No | 15m | Access token expiry |
| JWT_REFRESH_EXPIRES_IN | No | 7d | Refresh token expiry |
| CLIENT_URL | No | http://localhost:4200 | Frontend URL for CORS |
| TELEGRAM_BOT_TOKEN | No | - | Telegram bot token |
| PRICE_CHECK_INTERVAL_MINUTES | No | 30 | Scheduler interval |
| PRICE_CHECK_TIMEOUT_MS | No | 15000 | HTTP timeout |
| PRICE_CHECK_DELAY_MS | No | 3000 | Delay between products |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Compile TypeScript
- `npm start` - Start production server

## Health Check

`GET /health`

Returns:
```json
{
  "status": "ok",
  "database": "connected",
  "telegram": "configured",
  "scheduler": "running",
  "timestamp": "2026-09-14T10:00:00Z"
}
```
