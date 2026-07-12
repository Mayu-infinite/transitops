# 🚛 TransitOps

> **Smart Transport Operations Platform**  
> Developed for **Odoo Hackathon 2026**

TransitOps is an end-to-end transport operations platform that digitizes fleet operations by centralizing vehicle, driver, trip, maintenance, fuel, and expense management into a single intelligent system.

Traditional transport companies often rely on spreadsheets and manual records, leading to scheduling conflicts, missed maintenance, duplicate vehicle assignments, expired driver licenses, and poor operational visibility.

TransitOps solves these challenges through automated business validations, centralized fleet management, and real-time analytics, enabling logistics teams to operate efficiently and make data-driven decisions.

---

# 🌟 Features

### 🔐 Authentication & Security
- JWT Authentication
- Role-Based Access Control (RBAC)
- Secure API authorization

### 📊 Dashboard
- Fleet KPIs
- Active Trips
- Fleet Utilization
- Drivers on Duty
- Operational Cost Summary
- Analytics Filters

### 🚚 Vehicle Management
- Register and manage fleet vehicles
- Track vehicle status
- Monitor load capacity
- Odometer tracking
- Vehicle lifecycle management

### 👨‍✈️ Driver Management
- Driver profiles
- License validation
- License expiry tracking
- Safety score monitoring
- Driver availability

### 🛣️ Trip Management
- Trip creation
- Vehicle assignment
- Driver assignment
- Dispatch workflow
- Trip completion
- Trip cancellation

### 🔧 Maintenance
- Maintenance scheduling
- Maintenance history
- Automatic vehicle availability management

### ⛽ Fuel & Expense Tracking
- Fuel logs
- Expense records
- Operational cost calculation
- Fuel efficiency monitoring

### 📈 Reports & Analytics
- Fleet utilization
- Operational costs
- Fuel efficiency
- Vehicle ROI
- CSV Export

---

# 🛡️ Business Rules Engine

TransitOps automatically enforces operational rules to maintain fleet integrity.

### Asset Availability
- Retired vehicles cannot be dispatched.
- Vehicles under maintenance cannot be assigned.
- Suspended drivers cannot be assigned.
- Drivers with expired licenses cannot be assigned.

### No Double Booking
- Vehicles already on an active trip cannot be dispatched again.
- Drivers already assigned to an active trip cannot be assigned again.

### Capacity Validation
Trips cannot be created if cargo exceeds the vehicle's maximum load capacity.

### Automated Status Transitions

| Action | Vehicle Status | Driver Status |
|---------|---------------|--------------|
| Dispatch Trip | On Trip | On Trip |
| Complete Trip | Available | Available |
| Cancel Trip | Available | Available |
| Start Maintenance | In Shop | — |
| Close Maintenance | Available | — |

---

# 🛠 Tech Stack

## Frontend
- Next.js
- React 19
- TypeScript
- Tailwind CSS v4
- HeroUI

## Backend
- NestJS
- Prisma ORM
- PostgreSQL
- Passport JWT
- Swagger
- TypeScript

---

# 🚀 Getting Started

## Prerequisites

- Node.js 20+
- pnpm
- Docker

---

## 1. Start Database

```bash
docker compose up -d
```

---

## 2. Backend Setup

```bash
cd backend

pnpm install

npx prisma migrate deploy

pnpm prisma:seed

pnpm start:dev
```

Backend runs on:

```
http://localhost:3000
```

Swagger Documentation (if enabled):

```
http://localhost:3000/api
```

---

## 3. Frontend Setup

```bash
cd frontend

pnpm install

pnpm dev
```

Frontend runs on:

```
http://localhost:3001
```

---

# 🔐 Environment Variables

## Backend (.env)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fleet

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

PORT=3000

CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

## Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

# 🧩 Backend Modules

- AuthModule
- UsersModule
- VehiclesModule
- DriversModule
- TripsModule
- MaintenanceModule
- FuelExpensesModule
- ReportsModule

---

# 📡 Core API Endpoints

## Authentication

```
POST /auth/login
GET  /auth/me
```

## Vehicles

```
GET    /vehicles
GET    /vehicles/dispatch-pool
GET    /vehicles/:id
POST   /vehicles
PATCH  /vehicles/:id
DELETE /vehicles/:id
```

## Drivers

```
GET    /drivers
GET    /drivers/dispatch-pool
GET    /drivers/expiring-licenses
GET    /drivers/:id
POST   /drivers
PATCH  /drivers/:id
```

## Trips

```
POST   /trips
GET    /trips
GET    /trips/counts
GET    /trips/active
GET    /trips/pending
GET    /trips/:id

PATCH  /trips/:id

POST   /trips/:id/dispatch
POST   /trips/:id/complete
POST   /trips/:id/cancel
```

## Maintenance

```
GET    /maintenance
GET    /maintenance/:id

POST   /maintenance

PATCH  /maintenance/:id
PATCH  /maintenance/:id/close
```

## Fuel & Expenses

```
POST   /fuel-expenses/fuel
GET    /fuel-expenses/fuel
PATCH  /fuel-expenses/fuel/:id

POST   /fuel-expenses/expenses
GET    /fuel-expenses/expenses
PATCH  /fuel-expenses/expenses/:id

GET /fuel-expenses/vehicle/:vehicleId/operational-cost
GET /fuel-expenses/vehicle/:vehicleId/fuel-efficiency
```

## Reports

```
GET /reports/dashboard
GET /reports/analytics
GET /reports/export/csv
```

---

# 🗄 Database Design

## Core Entities

- Users
- Vehicles
- Drivers
- Trips
- Maintenance
- Fuel Logs
- Expenses

The schema is implemented using **Prisma ORM**, providing type-safe relational database access.

### Relationships

- A User creates Trips and Maintenance records.
- A Vehicle participates in multiple Trips.
- A Driver can complete multiple Trips over time.
- A Vehicle has multiple Maintenance records.
- A Vehicle has multiple Fuel Logs.
- A Vehicle has multiple Expense records.

---

# 📂 Project Structure

```text
transitops/
├── frontend/      # Next.js Application
├── backend/       # NestJS API
└── README.md
```

---

# 👥 Team Workflow

- Feature-based Git branches
- Pull Requests into `develop`
- Collaborative module development
- Frequent commits during the hackathon

## Team Contribution Summary

| Member | Contribution |
|---------|--------------|
| **Mayuri** | Fleet Management, Trip Management, Frontend Views, API Integration |
| **Saichandana** | Driver Management, Maintenance, Fuel & Expenses, Reports & Analytics, Settings & RBAC |
| **Backend Team** | Shared collaboration across backend modules and Reports APIs |

---

# 🎯 Objective

TransitOps modernizes transport operations by replacing fragmented manual processes with a centralized digital platform. Through workflow automation, business rule validation, and operational analytics, it helps organizations improve fleet utilization, reduce scheduling conflicts, ensure compliance, and make better operational decisions.

---

## ❤️ Built for Odoo Hackathon 2026

**TransitOps — Smart Fleet Management for Modern Logistics**
