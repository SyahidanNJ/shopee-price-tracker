# System Architecture

## Overview
Shopee Price Tracker is a monorepo application that monitors Shopee product prices and sends Telegram notifications when prices drop.

## Architecture Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Angular    │────▶│  Express    │────▶│  PostgreSQL │
│  Frontend   │     │   API       │     │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │  Scheduler  │
                    │  node-cron  │
                    └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │ Price Check │
                    │ Axios+Cheerio│
                    └─────────────┘
                          │
                          ▼
                    ┌─────────────┐
                    │  Telegram   │
                    │  grammY     │
                    └─────────────┘
```

## Components

### Frontend (Angular)
- User interface for dashboard
- Product management
- Alert settings
- Telegram binding

### Backend (Express.js)
- REST API with `/api` prefix
- JWT authentication
- Price checker service
- Scheduler
- Telegram webhook

### Database (PostgreSQL + Sequelize)
- User data
- Products
- Price snapshots
- Alerts
- Notification logs

### External Services
- Shopee (product data via scraping)
- Telegram (notifications)

## Deployment
- Frontend: Vercel, Netlify, or VPS
- Backend: Railway, Render, or VPS
- Database: Managed PostgreSQL or Docker
