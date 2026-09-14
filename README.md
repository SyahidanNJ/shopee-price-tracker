# Shopee Price Tracker

A monorepo application for tracking Shopee product prices with Telegram notifications.

## Project Structure

```
shopee-price-tracker/
├── backend/          # Express.js API
├── frontend/         # Angular application
├── docs/             # Documentation
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

### Database (Docker)
```bash
docker-compose up -d
```

## Tech Stack
- **Frontend**: Angular, Tailwind CSS
- **Backend**: Express.js, TypeScript, Sequelize
- **Database**: PostgreSQL
- **External**: Telegram Bot, Shopee API

## Documentation
- [PRD](docs/PRD.md)
- [Architecture](docs/architecture.md)
- [API Contract](docs/api-contract.md)
- [Database Schema](docs/database-schema.md)

## License
MIT
