# Database Schema

## ER Diagram
```
users ──< refresh_tokens
users ──< telegram_bindings
users ──< products ──< price_snapshots
users ──< alerts ──< notification_logs
products ──< price_check_logs
```

## Tables

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### refresh_tokens
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK -> users.id |
| token_hash | VARCHAR(255) | NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| revoked_at | TIMESTAMP | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### telegram_bindings
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK -> users.id |
| telegram_user_id | VARCHAR(50) | NOT NULL |
| telegram_username | VARCHAR(100) | NULL |
| binding_code | VARCHAR(50) | UNIQUE, NOT NULL |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### products
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK -> users.id |
| name | VARCHAR(500) | NOT NULL |
| source_url | TEXT | NOT NULL |
| normalized_url | TEXT | NOT NULL |
| shopee_item_id | VARCHAR(50) | NULL |
| shopee_shop_id | VARCHAR(50) | NULL |
| image_url | TEXT | NULL |
| current_price | INTEGER | NULL |
| currency | VARCHAR(10) | DEFAULT 'IDR' |
| status | VARCHAR(20) | DEFAULT 'active' |
| last_checked_at | TIMESTAMP | NULL |
| last_notified_price | INTEGER | NULL |
| last_notified_at | TIMESTAMP | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### price_snapshots
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| product_id | UUID | FK -> products.id |
| price | INTEGER | NULL |
| original_price | INTEGER | NULL |
| discount_price | INTEGER | NULL |
| stock_status | VARCHAR(50) | NULL |
| raw_data | JSONB | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

### alerts
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK -> users.id |
| product_id | UUID | FK -> products.id |
| is_active | BOOLEAN | DEFAULT TRUE |
| alert_type | VARCHAR(20) | NOT NULL |
| target_price | INTEGER | NULL |
| min_drop_percentage | NUMERIC(5,2) | NULL |
| cooldown_minutes | INTEGER | DEFAULT 360 |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### notification_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FK -> users.id |
| product_id | UUID | FK -> products.id |
| alert_id | UUID | FK -> alerts.id |
| channel | VARCHAR(20) | NOT NULL |
| status | VARCHAR(20) | NOT NULL |
| telegram_message_id | VARCHAR(50) | NULL |
| error_message | TEXT | NULL |
| sent_at | TIMESTAMP | DEFAULT NOW() |

### price_check_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| product_id | UUID | FK -> products.id |
| status | VARCHAR(20) | NOT NULL |
| error_message | TEXT | NULL |
| duration_ms | INTEGER | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |

## Indexes
- users(email)
- products(user_id, status)
- price_snapshots(product_id, created_at)
- alerts(user_id, product_id)
- telegram_bindings(user_id, binding_code)
