# 👤 user-service — User Profiles & Dashboard

> Manages farmer profiles, addresses, surveys, admin users, and the farmer dashboard.

## What This Service Does

- Farmer profile management (view, update, language, preferences)
- Delivery address CRUD
- Farmer onboarding survey
- Admin user management (list, create, role changes, deactivation)
- Farmer dashboard (alerts, farm status, dashboard data)
- District-based user listing

## Port: 3002

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| User | users | User profiles (shared with auth-service) |
| UserAddress | user_addresses | Farmer delivery addresses |
| FarmerSurvey | farmer_surveys | Onboarding survey responses |
| AdminUser | admin_users | Admin staff accounts (shared with auth-service) |

## API Endpoints

### Profile (`/api/users/profile/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/profile/data` | JWT | Get user profile + addresses |
| PUT | `/api/users/profile/update` | JWT | Update profile fields |
| POST | `/api/users/profile/language` | JWT | Update language preference |
| POST | `/api/users/profile/preferences` | JWT | Update user preferences |

### Addresses (`/api/users/addresses/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/addresses/` | JWT | List addresses |
| POST | `/api/users/addresses/` | JWT | Add address |
| PUT | `/api/users/addresses/:id` | JWT | Update address |
| DELETE | `/api/users/addresses/:id` | JWT | Delete address |

### Survey (`/api/survey/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/survey/status` | JWT | Get survey completion status |
| POST | `/api/survey/submit` | JWT | Submit/update farmer survey |

### Farmer Dashboard (`/api/users/farmer/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/farmer/dashboard` | JWT | Dashboard data |
| POST | `/api/users/farmer/alerts/:id/read` | JWT | Mark alert read |
| POST | `/api/users/farmer/alerts/read-all` | JWT | Mark all alerts read |
| POST | `/api/users/farmer/farm-status` | JWT | Submit farm status |

### Admin (`/api/users/admin/*`)

| Method | Path | Auth | Permission |
|--------|------|------|-----------|
| GET | `/api/users/admin/users` | JWT | `user:read` |
| GET | `/api/users/admin/districts` | JWT | `user:read` |
| PUT | `/api/users/admin/users/:id/role` | JWT | `user:write` |
| POST | `/api/users/admin/users/:id/deactivate` | JWT | `user:write` |
| GET | `/api/users/admin/staff` | JWT | `admin:read` |
| GET | `/api/users/admin/staff/:id` | JWT | `admin:read` |
| POST | `/api/users/admin/staff` | JWT | `admin:write` |
| PUT | `/api/users/admin/staff/:id/role` | JWT | `admin:write` |
| POST | `/api/users/admin/staff/:id/deactivate` | JWT | `admin:write` |
| DELETE | `/api/users/admin/staff/:id` | JWT | `admin:write` |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.user` | `user.profile_updated` | Profile changed |
| `kissan.user` | `user.role_changed` | Role assigned/changed |
| `kissan.user` | `farmer.onboarded` | Survey completed |
| `kissan.user` | `user.language_changed` | Language preference changed |

## Key Files

```
src/
├── routes/
│   ├── user.routes.js           ← Profile routes
│   ├── address.routes.js        ← Address CRUD routes
│   ├── survey.routes.js         ← Farmer survey routes
│   ├── admin-user.routes.js     ← Admin management routes
│   └── dashboard.routes.js      ← Farmer dashboard routes
├── controllers/
│   ├── user.controller.js       ← Profile + admin user listing
│   ├── address.controller.js    ← Address CRUD
│   ├── survey.controller.js     ← Survey submit/status
│   ├── admin-user.controller.js ← Admin staff CRUD
│   └── dashboard.controller.js  ← Dashboard data
├── services/
│   ├── user.service.js          ← Profile logic
│   ├── address.service.js       ← Address logic
│   ├── survey.service.js        ← Survey logic
│   ├── admin-user.service.js    ← Admin management
│   ├── dashboard.service.js     ← Dashboard aggregation
│   └── weather.service.js       ← Weather data for dashboard
├── repositories/
│   └── admin-user.repository.js ← Admin DB queries
├── validators/user.validator.js ← Joi schemas
└── index.js
```
