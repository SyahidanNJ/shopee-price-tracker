# Telegram Bot Setup

## Bot Creation

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions:
   - Choose bot name (e.g., "Shopee Price Tracker")
   - Choose username (must end with `bot`)
4. Save the bot token

## Configuration

**Development (Long Polling):**
Add to `.env`:
```
TELEGRAM_BOT_TOKEN=your_bot_token
```

**Production (Webhook):**
Add to `.env`:
```
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret
```

Set webhook via Telegram API:
```bash
curl -X POST "https://api.telegram.org/botYOUR_TOKEN/setWebhook?url=https://yourdomain.com/webhook/telegram&secret_token=YOUR_SECRET"
```

## Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Start bot and optionally bind account |
| `/bind CODE` | Connect account with binding code |
| `/status` | Show binding status |
| `/test` | Send test notification |
| `/help` | Show help message |

## Binding Flow

1. User visits `/telegram` on web
2. Clicks "Generate Binding Code"
3. Receives code (e.g., `BIND_ABC123`)
4. Opens Telegram bot
5. Sends `/start BIND_ABC123`
6. Bot validates and binds
7. User sees "Connected" status

## Security

- Webhook uses `secret_token` for verification
- Only binds with valid codes
- Handles user blocking gracefully
- Stores `telegram_user_id` for notifications

## Notification Template

```
💰 Price Drop Alert!

📦 Product: [Product Name]
📉 Old Price: Rp 120,000
📊 New Price: Rp 89,000
💵 Drop: Rp 31,000 (25.8%)

Cek produk: https://shopee.co.id/i/...
```
