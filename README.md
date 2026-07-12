# TransitOps

**TransitOps** is a Smart Transport Operations Platform developed for the **Odoo Hackathon 2026**. The platform digitizes fleet operations by providing centralized management for vehicles, drivers, trips, maintenance, fuel logs, expenses, and operational analytics.

---

## 🚀 Tech Stack

### Frontend
- Next.js

### Backend
- NestJS
- Prisma ORM
- PostgreSQL

## 📌 Features

- Authentication & Role-Based Access Control (RBAC)
- Dashboard with Fleet KPIs
- Vehicle Registry Management
- Driver Management
- Trip Management
- Maintenance Workflow
- Fuel & Expense Tracking
- Reports & Analytics
- Business Rule Validation

---

## ⚙️ Setup & Run

### Prerequisites
- Node.js 20+
- pnpm
- Docker (for PostgreSQL)

### 1. Start Database

```bash
docker compose up -d
```

### 2. Backend Setup

```bash
cd backend
pnpm install
npx prisma migrate deploy
pnpm prisma:seed
pnpm start:dev
```

Backend runs on: http://localhost:3000

### 3. Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on: http://localhost:3001

---

## 🔐 Environment Variables

### Backend (.env)
- DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fleet
- JWT_SECRET=your_jwt_secret
- JWT_EXPIRES_IN=7d
- PORT=3000
- CORS_ORIGIN=http://localhost:3001,http://localhost:3000

### Frontend (.env.local)
- NEXT_PUBLIC_API_URL=http://localhost:3000

---

## 🧩 API / Backend Modules

The backend currently registers these modules:

- AuthModule
- UsersModule
- VehiclesModule
- DriversModule
- TripsModule
- MaintenanceModule
- FuelExpensesModule
- ReportsModule

### Core API Endpoints

#### Authentication
- POST /auth/login
- GET /auth/me

#### Vehicles
- GET /vehicles
- GET /vehicles/dispatch-pool
- GET /vehicles/:id
- POST /vehicles
- PATCH /vehicles/:id
- DELETE /vehicles/:id

#### Drivers
- GET /drivers
- GET /drivers/dispatch-pool
- GET /drivers/expiring-licenses
- GET /drivers/:id
- POST /drivers
- PATCH /drivers/:id

#### Trips
- POST /trips
- GET /trips
- GET /trips/counts
- GET /trips/active
- GET /trips/pending
- GET /trips/:id
- PATCH /trips/:id
- POST /trips/:id/dispatch
- POST /trips/:id/complete
- POST /trips/:id/cancel

#### Maintenance
- GET /maintenance
- GET /maintenance/:id
- POST /maintenance
- PATCH /maintenance/:id
- PATCH /maintenance/:id/close

#### Fuel & Expenses
- POST /fuel-expenses/fuel
- GET /fuel-expenses/fuel
- PATCH /fuel-expenses/fuel/:id
- POST /fuel-expenses/expenses
- GET /fuel-expenses/expenses
- PATCH /fuel-expenses/expenses/:id
- GET /fuel-expenses/vehicle/:vehicleId/operational-cost
- GET /fuel-expenses/vehicle/:vehicleId/fuel-efficiency

#### Reports
- GET /reports/dashboard
- GET /reports/analytics
- GET /reports/export/csv

---

## 🏗️ System Modules

### Vehicle Management
- Register and manage fleet vehicles
- Track vehicle status
- Monitor load capacity and odometer

### Driver Management
- Maintain driver profiles
- License validation
- Safety score tracking

### Trip Management
- Create and manage transport trips
- Vehicle and driver assignment
- Automatic status transitions

### Maintenance
- Schedule maintenance records
- Vehicle availability management

### Fuel & Expense
- Record fuel logs
- Track operational expenses
- Calculate total operating costs

### Dashboard & Analytics
- Fleet utilization
- Active trips
- Operational costs
- Fuel efficiency
- Vehicle ROI

---

## 📂 Project Structure

```
transitops/
├── frontend/      # Next.js Application
├── backend/       # NestJS API
└── README.md
```

---

## 🗄️ Database Overview

The system is designed around the following core entities:

- Users
- Vehicles
- Drivers
- Trips
- Maintenance
- Fuel Logs
- Expenses

These entities are connected through relational mappings to support fleet operations and enforce business rules.

---
## 🗃️ Database Design

The backend database is designed using a relational schema centered around the following entities:

- **User** – Authentication, authorization, and role management.
- **Vehicle** – Vehicle registration, specifications, status, and operational details.
- **Driver** – Driver information, license details, safety score, and availability.
- **Trip** – Source, destination, assigned vehicle, assigned driver, cargo details, trip status, and revenue.
- **Maintenance** – Vehicle maintenance history, cost, schedule, and maintenance status.
- **Fuel Log** – Fuel consumption, odometer readings, and fuel costs.
- **Expense** – Vehicle-related operational expenses.

### Entity Relationships

- A **User** creates Trips and Maintenance records.
- A **Vehicle** can participate in multiple Trips.
- A **Driver** can be assigned to multiple Trips over time.
- A **Vehicle** has multiple Maintenance records.
- A **Vehicle** has multiple Fuel Logs.
- A **Vehicle** has multiple Expense records.

The schema is implemented using **Prisma ORM**, providing type-safe database access and relational data management.

## 👥 Team Workflow

- Feature-based Git branches
- Pull Requests into `develop`
- Hourly commits during hackathon development

### Team Contribution Summary

- Mayuri: Fleet and Trip modules (frontend views and API integration)
- Saichandana: Drivers, Maintenance, Fuel & Expenses, Analytics, Settings & RBAC
- Backend: Shared module-wise collaboration with Reports/Analytics APIs added in latest merge

---

## 🎯 Objective

Build a scalable transport operations platform that streamlines fleet management while ensuring operational efficiency through automated workflows, business validations, and analytics.