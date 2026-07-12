# TransitOps 🚛

**Smart Transport Operations Platform**

TransitOps is an end-to-end transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management while enforcing strict business rules and providing real-time operational insights. Built during an 8-Hour Hackathon, this centralized platform helps logistics companies eliminate spreadsheets, avoid scheduling conflicts, and maximize fleet utilization.

## 🌟 Key Features

*   **Secure Authentication:** Role-Based Access Control (RBAC) ensuring secure access for Fleet Managers, Drivers, Safety Officers, and Financial Analysts.
*   **Real-time Dashboard:** Track KPIs like Active Vehicles, Fleet Utilization (%), and Drivers On Duty at a glance with advanced filtering capabilities.
*   **Vehicle Registry:** Full lifecycle management of vehicles with automatic status tracking (Available, On Trip, In Shop, Retired).
*   **Driver Management:** Comprehensive driver profiles tracking license validity, safety scores, and availability statuses.
*   **Smart Trip Dispatching:** Automated validations ensure cargo doesn't exceed vehicle capacity, licenses aren't expired, and assets aren't double-booked.
*   **Maintenance Logs:** Automated status transitions pull vehicles into the shop and return them to the active pool when repairs are closed.
*   **Fuel & Expense Tracking:** Log fuel consumption and operational costs (tolls, insurance) for automated profitability calculations.
*   **Advanced Analytics & Reports:** Instant visibility into Fuel Efficiency, Operational Costs, and Vehicle ROI, with CSV export functionality.

## 🛡️ Business Rules Engine

Our backend strictly enforces the following rules to ensure operational integrity:
*   **Asset Availability:** Retired or "In Shop" vehicles, and "Suspended" or expired-license drivers are automatically blocked from dispatch.
*   **No Double Booking:** Drivers or vehicles already "On Trip" cannot be assigned to new trips until completion.
*   **Capacity Enforcement:** Trip creation is blocked if Cargo Weight exceeds the vehicle's maximum load capacity.
*   **Automated Status Transitions:** 
    *   Dispatching a trip switches both vehicle and driver to `On Trip`.
    *   Completing or cancelling a trip restores them to `Available`.
    *   Opening a maintenance record automatically flags the vehicle as `In Shop`.

## 🛠️ Tech Stack

**Backend:**
*   NestJS (Modular Architecture)
*   Prisma ORM
*   PostgreSQL
*   TypeScript
*   Swagger (API Documentation)
*   Passport-JWT (Authentication)

**Frontend:**
*   Next.js (App Router)
*   React 19
*   Tailwind CSS (v4)
*   HeroUI
*   TypeScript

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL
*   npm or pnpm

### Backend Setup
```bash
cd backend
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Apply database migrations
npx prisma migrate dev
npx prisma generate

# Start the NestJS server
npm run start:dev
```

### Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

The frontend will be available at `http://localhost:3001` and the backend API at `http://localhost:3000`. 
API Documentation (Swagger) can be accessed at `http://localhost:3000/api` (if configured).

## 📊 Database Entities
The application is built on a fully normalized relational schema encompassing:
`Users`, `Roles`, `Vehicles`, `Drivers`, `Trips`, `Maintenance Logs`, `Fuel Logs`, and `Expenses`.

---
*Built with ❤️ for the TransitOps Smart Transport Operations Platform Hackathon.*