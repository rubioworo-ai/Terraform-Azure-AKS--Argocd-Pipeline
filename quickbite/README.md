# QuickBite Food Delivery Application

QuickBite is a highly-scalable, resilient, and professional microservices-based food delivery application. The platform allows customers to view active restaurant listings, explore menus organized by category, build and manage a real-time order basket, execute a secure checkout, and track their delivery status with dynamic updates.

---

## 1. Final Architecture

The platform is designed with a decentralized, containerized microservices architecture to ensure high performance, fault isolation, and independent deployment cycles.

```
                    ┌────────────────────────┐
                    │     React Frontend     │
                    │      (Port 3000)       │
                    └───────────┬────────────┘
                                │ (HTTP REST / Axios)
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│Restaurant Service│  │  Order Service   │  │Notification Serv.│
│   (Spring Boot)  │  │   (Spring Boot)  │  │   (Spring Boot)  │
│    (Port 8081)   │  │    (Port 8082)   │  │    (Port 8083)   │
└────────┬─────────┘  └────────┬─────────┘  └──────────────────┘
         │                     │
         └──────────┬──────────┘
                    ▼
          ┌──────────────────┐
          │    PostgreSQL    │
          │   (Port 5432)    │
          └──────────────────┘
```

### Core Services
1. **Frontend Service (React + Vite)**: Exposes a beautiful, fully responsive culinary UI incorporating elegant typography, cards, slide-over summary drawers, and a dynamic vertical delivery status tracker.
2. **Restaurant Service (Spring Boot + JPA)**: Handles active restaurant lists and associated menus. Exposes `GET /api/restaurants` and `GET /api/restaurants/{id}/menu` from an isolated PostgreSQL schema.
3. **Order Service (Spring Boot + JPA)**: Creates and monitors orders. Manages transaction lifecycle of orders in PostgreSQL and exposes `POST /api/orders` and `GET /api/orders/{id}` with state-machine tracking (`PENDING` -> `PREPARING` -> `OUT_FOR_DELIVERY` -> `DELIVERED`).
4. **Notification Service (Spring Boot)**: Simulates push-notification networks. Listens to order triggers on `POST /api/notifications` and returns `"Your order has been received"`.
5. **Database (PostgreSQL)**: Serves as the durable relation store for restaurant cataloging and order tracking.

---

## 2. Directory Structure

The repository is structured strictly as requested:

```
quickbite/
├── .env                              # Shared database and config secrets
├── docker-compose.yml                # Production orchestrated environment launcher
├── README.md                         # This architecture and manual handbook
├── database/
│   └── schema.sql                    # Initial SQL schema for catalog seeding
├── frontend/                         # React Frontend Application
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/                          # App component, modules, and styling
└── backend/                          # Spring Boot Java Microservices
    ├── restaurant-service/           # Restaurant catalogue service
    │   ├── pom.xml
    │   └── src/main/java/com/quickbite/restaurant/...
    ├── order-service/                # Customer transaction/order service
    │   ├── pom.xml
    │   └── src/main/java/com/quickbite/order/...
    └── notification-service/         # Alert dispatcher simulation
        ├── pom.xml
        └── src/main/java/com/quickbite/notification/...
```

---

## 3. Environment Configuration

To preserve database security, credentials are not hardcoded. Define them in a root `.env` file:

```env
# Database Credentials
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=quickbite_user
DATABASE_PASSWORD=quickbite_secure_pass
DATABASE_DB=quickbite_db

# Service Envs
RESTAURANT_SERVICE_URL=http://restaurant-service:8081
ORDER_SERVICE_URL=http://order-service:8082
NOTIFICATION_SERVICE_URL=http://notification-service:8083
```

---

## 4. Run With Docker (Recommended / Zero Config)

To start the entire full-stack ecosystem (Postgres database, 3 Spring Boot microservices, and React frontend) in a single orchestrated command:

### 1. Build and boot containers
```bash
docker-compose up --build
```

### 2. Access points
* **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
* **Restaurant Service**: [http://localhost:8081/api/restaurants](http://localhost:8081/api/restaurants)
* **Order Service**: [http://localhost:8082/api/orders](http://localhost:8082/api/orders)
* **Notification Service**: [http://localhost:8083/api/notifications](http://localhost:8083/api/notifications)
* **PostgreSQL Database**: Port `5432`

---

## 5. Run Locally Without Docker (Manual Start)

If you wish to test, develop, or compile without Docker, execute the components individually.

### Prerequisites
* **Java SDK 17+** (JDK)
* **Node.js v18+**
* **Maven v3+**
* **Local running PostgreSQL Server**

### Step A: Database Setup
1. Create a PostgreSQL database named `quickbite_db` on your local host.
2. Initialize tables and seed records using the SQL file `/database/schema.sql`.

### Step B: Run Backend Microservices

In separate terminal tabs, navigate to each service and execute:

#### 1. Restaurant Service (Port 8081)
```bash
cd backend/restaurant-service
mvn clean install
mvn spring-boot:run
```

#### 2. Order Service (Port 8082)
```bash
cd backend/order-service
mvn clean install
mvn spring-boot:run
```

#### 3. Notification Service (Port 8083)
```bash
cd backend/notification-service
mvn clean install
mvn spring-boot:run
```

### Step C: Run React Frontend (Port 3000)
1. Open a new terminal tab.
2. Navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
3. Open [http://localhost:3000](http://localhost:3000) to browse and place orders!
