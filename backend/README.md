# Backend

Backend API service for Shopee Price Tracker.

## Tech Stack
- Node.js + Express
- TypeScript
- Sequelize ORM
- PostgreSQL

## Setup
1. `npm install`
2. `cp .env.example .env`
3. Configure environment variables
4. `npm run dev`

## API
See `/api` prefix endpoints
See `docs/api-contract.md`

## Environment Variables
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Access token expiry
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiry
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
