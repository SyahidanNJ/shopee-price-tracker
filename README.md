# Shopee Price Tracker

A monorepo application for tracking Shopee product prices with Telegram notifications.

## Quick Start

### Manual Development

**Database:**
```bash
docker-compose up -d db
```

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

Access the application:
- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- Health check: http://localhost:3000/health

### Docker Development

```bash
docker-compose up
```

All services start together:
- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

## Project Structure

```
shopee-price-tracker/
├── backend/              # Express.js API
├── frontend/             # Angular application
├── docs/                 # Documentation
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Tech Stack

- **Frontend**: Angular 17, Reactive Forms, HttpClient
- **Backend**: Express.js, TypeScript, Sequelize, PostgreSQL
- **External**: Telegram Bot (grammY), Shopee (Axios + Cheerio)

## Key Features

- User authentication with JWT access + refresh tokens
- Shopee product price tracking
- Price history snapshots
- Alert system (any_drop, target_price, min_drop_percentage)
- Telegram binding and notifications
- Scheduler for automatic price checks

## Documentation

- [PRD](docs/PRD.md)
- [Architecture](docs/architecture.md)
- [API Contract](docs/api-contract.md)
- [Database Schema](docs/database-schema.md)
- [Deployment Guide](docs/deployment.md)
- [Telegram Bot Setup](docs/telegram-bot.md)

## Environment Variables

### Backend (.env.example)
```
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/shopee_price_tracker
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-secret-key
TELEGRAM_BOT_TOKEN=your-bot-token
```

### Frontend
- `src/environments/environment.ts` - Development (http://localhost:3000/api)
- `src/environments/environment.prod.ts` - Production

## License

MIT
