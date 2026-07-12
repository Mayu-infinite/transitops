# TransitOps

**TransitOps** is a Smart Transport Operations Platform developed for the **Odoo Hackathon 2026**. The platform digitizes fleet operations by providing centralized management for vehicles, drivers, trips, maintenance, fuel logs, expenses, and operational analytics.

---

## 🚀 Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- NestJS
- Prisma ORM
- PostgreSQL

---

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

## 👥 Team Workflow

- Feature-based Git branches
- Pull Requests into `develop`
- Hourly commits during hackathon development

---

## 🎯 Objective

Build a scalable transport operations platform that streamlines fleet management while ensuring operational efficiency through automated workflows, business validations, and analytics.