# API Contract

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://api.domain.com/api`

## Authentication
All private endpoints require JWT Bearer token in Authorization header.

```
Authorization: Bearer <access_token>
```

## Auth Endpoints

### POST /api/auth/register
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```
Response: `201 Created` with user data

### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
Response: `200 OK` with access_token, refresh_token, user

### POST /api/auth/refresh
Request: JSON with refreshToken
```json
{
  "refreshToken": "..."
}
```
Response: `200 OK` with new access_token, refresh_token

### POST /api/auth/logout
Request: Authorization header with access_token
Response: `200 OK`

### GET /api/auth/me
Response: `200 OK` with current user

## Product Endpoints

### GET /api/products
Response: `200 OK` with products list

### POST /api/products
```json
{
  "source_url": "https://shopee.co.id/product-link"
}
```
Response: `201 Created` with product data

### GET /api/products/:id
Response: `200 OK` with product details

### DELETE /api/products/:id
Response: `200 OK`

### PATCH /api/products/:id
```json
{
  "status": "paused"
}
```

## Alert Endpoints

### GET /api/products/:id/alert
Response: `200 OK` with alert settings

### PUT /api/products/:id/alert
```json
{
  "is_active": true,
  "alert_type": "any_drop",
  "target_price": 50000,
  "min_drop_percentage": 10,
  "cooldown_minutes": 360
}
```

## Telegram Endpoints

### GET /api/telegram/status
Response: `200 OK` with binding status

### POST /api/telegram/bind
Response: `201 Created` with binding_code

### POST /api/telegram/unbind
Response: `200 OK`

### POST /api/telegram/test
Response: `200 OK`

## System Endpoints

### GET /health
Response:
```json
{
  "status": "ok",
  "database": "connected",
  "telegram": "ok",
  "scheduler": "ok",
  "timestamp": "2026-09-14T10:00:00Z"
}
```

### POST /webhook/telegram
Telegram bot webhook handler

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error
