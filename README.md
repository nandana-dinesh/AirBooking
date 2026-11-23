# ✈️ AirBooking — Flight Booking & Real-Time Telemetry Platform

A full-stack flight reservation platform built with **Django REST Framework** (Backend) and **React 19 / Vite / Tailwind CSS** (Frontend), featuring interactive seat selection, concurrency-safe transactions, simulated payments, live OpenSky Network flight radar telemetry, and an administrator approval workflow.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Core Requirements vs. Additional Features](#-core-requirements-vs-additional-features)
4. [Application Screenshots](#-application-screenshots)
5. [Working Demonstration Video](#-working-demonstration-video)
6. [Folder Structure](#-folder-structure)
7. [Prerequisites](#-prerequisites)
8. [Backend Setup](#-backend-setup)
9. [Frontend Setup](#-frontend-setup)
10. [Environment Variables](#-environment-variables)
11. [Running the Application](#-running-the-application)
12. [API Endpoints](#-api-endpoints)
13. [Demo Credentials](#-demo-credentials)
14. [Running Tests](#-running-tests)
15. [Known Limitations & Architecture Decisions](#-known-limitations--architecture-decisions)

---

## 🛫 Project Overview

AirBooking is a full-stack flight reservation web application developed for the Full Stack Developer assignment. It demonstrates clean architecture, RESTful API design, database transaction management, and responsive frontend engineering.

### Key Capabilities
- **Customer Experience:** Search domestic flights across Indian hubs, interact with a visual aircraft cabin map to pick seats, proceed through a simulated checkout, receive an authentic boarding pass, view booking history in **"My Trips"**, and track live flight radar coordinates.
- **Admin Workflow:** Review and approve/reject newly registered user accounts, manage flight schedules and on-time status, and view platform-wide business analytics.
- **Background Jobs:** Asynchronous email notifications powered by Celery for account activations.

---

## 🛠 Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Backend Framework** | Django 5.2 & Django REST Framework | RESTful architecture, ModelViewSet/APIViews, permissions |
| **Authentication** | SimpleJWT | JSON Web Token (JWT) access & refresh tokens |
| **Database** | PostgreSQL & SQLite | Dual support: PostgreSQL (production) & SQLite (local development) |
| **Task Queue** | Celery + Redis | Asynchronous email dispatch (with synchronous fallback) |
| **Flight Telemetry** | OpenSky Network REST API | Server-side query of live ADS-B aircraft state vectors |
| **Frontend Framework** | React 19 + Vite | Fast HMR, component-driven UI, Context API state management |
| **Styling** | Tailwind CSS | Modern, fully responsive aviation design system |
| **HTTP Client** | Axios | Interceptors with automatic JWT Authorization header attachment |
| **Configuration** | python-dotenv | 12-factor app security, strict environment isolation |

---

## 🌟 Core Requirements vs. Additional Features

The application satisfies all mandatory assignment specifications and introduces thoughtful engineering enhancements beyond the brief.

### 1. Core Mandatory Requirements Implemented
* **Custom User Model with Approval Flow:** `approval_status` field with `pending`, `approved`, and `rejected` states. Only approved users can authenticate.
* **JWT Authentication:** Secure user registration, login, and token refresh via SimpleJWT.
* **Flight Search & Filtering:** Filter flights by origin airport, destination airport, and departure date.
* **Booking Creation & Management:** Customers can book flights, view reservations in "My Trips", and cancel bookings.
* **Admin Management Portal:** Review pending registrations, approve or reject users, update flight details and status (`On-Time`, `Delayed`, `Cancelled`).
* **Real-Time Status Display:** Live flight tracking integration with external radar services.
* **Asynchronous Email Notification:** Celery task triggers when an administrator approves an account.

### 2. Additional Features & Innovations (Beyond Requirements)
* **💺 Interactive Aircraft Seat Map:** A visual cabin layout distinguishing Business Class and Economy Class rows with real-time seat lock indicators and tier-adjusted pricing.
* **🔒 Concurrency-Safe Seat Reservations (`select_for_update`):** Solves the race condition where multiple users attempt to reserve the same seat simultaneously. Availability checks and seat reservations run inside an atomic transaction with `select_for_update()` row-level locks on PostgreSQL.
* **📡 Transparent OpenSky Telemetry Badges:** Genuine OpenSky REST API integration that clearly displays **`🟢 Live ADS-B`** when active state-vectors are received, or **`🟡 Estimated from Schedule`** when aircraft are out of ADS-B coverage or rate limits are reached. Telemetry values are never disguised as fake live data.
* **🎫 Electronic Boarding Pass Generator:** A downloadable/printable boarding pass modal with booking reference (PNR), electronic ticket number, gate, terminal, and barcode.
* **🐘 Dual Database Architecture:** Configured via `DATABASE_URL` in `backend/config/settings.py`. Runs seamlessly on PostgreSQL for production row-level locking while maintaining an effortless SQLite fallback for zero-dependency local testing.
* **🛡️ Hardened Security Isolation:** No hardcoded secrets. All sensitive keys are loaded via `.env` (`python-dotenv`), CORS origins are explicitly restricted, and legacy keys have been sanitized from Git commit history.
* **🇮🇳 Authentic Indian Flight Network:** Pre-seeded with 21 domestic routes across major hubs (DEL, BOM, BLR, MAA, HYD, CCU, COK) with calibrated distance metrics, baggage allowance tags, meal tags, and realistic fares exceeding ₹4,000 INR.
* **📊 Admin Platform Analytics:** Real-time business metrics tracking platform revenue, active bookings, top routes, and user registration conversion.

---

## 📸 Application Screenshots

All screenshots below represent the actual running application and are located in [`docs/screenshots/`](docs/screenshots/).

### 1. Homepage & Discovery
![01 - Homepage](docs/screenshots/01_homepage.png)
*Indian domestic route discovery, platform statistics, and quick flight search interface.*

---

### 2. Flight Search & Results
![02 - Flight Search & Results](docs/screenshots/02_flight_search.png)
*Flight listings showing airline branding, baggage rules, complimentary meals, price filters, and departure times.*

---

### 3. Interactive Cabin Seat Selection
![03 - Interactive Seat Map](docs/screenshots/03_seat_map.png)
*Visual cabin layout showing Business and Economy seating, real-time availability, and seat selection.*

---

### 4. Simulated Demo Payment Gateway
![04 - Demo Checkout & Simulated Payment](docs/screenshots/04_demo_checkout.png)
*Demo checkout modal with transparent simulation disclosure banner and UPI / card payment options.*

---

### 5. Electronic Boarding Pass
![05 - Electronic Boarding Pass](docs/screenshots/05_boarding_pass.png)
*Generated DGCA-compliant electronic boarding pass featuring PNR, seat assignment, gate, terminal, and barcode.*

---

### 6. Real-Time Flight Radar & Telemetry
![06 - Live Flight Radar & Telemetry](docs/screenshots/06_live_tracker.png)
*OpenSky Network radar tracking interface with transparent Live ADS-B and schedule-based estimate indicators.*

---

### 7. Customer Trip Management ("My Trips")
![07 - Customer My Trips](docs/screenshots/07_my_trips.png)
*User trip dashboard displaying confirmed bookings, boarding pass access, telemetry shortcuts, and cancellation.*

---

### 8. Administrator Dashboard
![08 - Administrator Dashboard](docs/screenshots/08_admin_dashboard.png)
*Admin console for reviewing pending user registrations, approving accounts, updating flight statuses, and inspecting revenue metrics.*

---

### 9. Authentication & One-Click Test Accounts
![09 - Authentication & Test Accounts](docs/screenshots/09_login_page.png)
*Sign-in interface featuring one-click demo credentials for Admin, Approved Passenger, and Pending User accounts.*

---

## 🎥 Working Demonstration Video

> **Demo Video Link:** `[VIDEO_URL_PLACEHOLDER]` *(Paste your Loom, Google Drive, or YouTube unlisted demonstration link here)*

### Recommended Walkthrough Sequence (2 Minutes):
1. **User Registration & Approval Workflow (0:00 - 0:30):**
   - Register a new customer account (`approval_status` defaults to `Pending`).
   - Demonstrate that login is blocked with an informative pending notice.
   - Log in to the Admin Dashboard (`admin` / `adminpassword123`) and click **Approve**.
   - Show the activation email dispatched via Celery in terminal logs.
2. **Flight Search, Seat Map & Simulated Checkout (0:30 - 1:15):**
   - Log in as the approved customer.
   - Search for flights between Delhi (DEL) and Mumbai (BOM).
   - Open the **Interactive Seat Map** and select an available seat.
   - Proceed to **Simulated Payment**, enter test UPI/Card details, and confirm.
   - View the generated **Boarding Pass** with PNR and gate assignment.
3. **Trip Management & Real-Time Telemetry (1:15 - 1:45):**
   - Open **"My Trips"** to verify the confirmed reservation.
   - Launch the **Live Radar & Telemetry** modal to view OpenSky coordinates.
   - Demonstrate booking cancellation and seat release back to the inventory.
4. **Admin Flight Management & Analytics (1:45 - 2:00):**
   - Update a flight status from `On-Time` to `Delayed`.
   - Inspect the platform-wide revenue and booking statistics.

---

## 📁 Folder Structure

```
airbooking/
│
├── backend/                            # Django REST Framework Backend
│   ├── config/                         # Core project configuration
│   │   ├── settings.py                 # Environment-driven settings (PostgreSQL/SQLite, CORS, JWT)
│   │   ├── urls.py                     # Root API URL routing
│   │   ├── celery.py                   # Celery application initialization
│   │   └── wsgi.py / asgi.py
│   │
│   ├── users/                          # User authentication & approval app
│   │   ├── models.py                   # Custom User model (approval_status: pending/approved/rejected)
│   │   ├── serializers.py              # JWT, registration, and user serializers
│   │   ├── views.py                    # Auth endpoints & admin user management views
│   │   ├── urls.py                     # /api/auth/* and /api/admin/users/* routes
│   │   └── tasks.py                    # Celery background email task
│   │
│   ├── flights/                        # Flights catalog & live tracking app
│   │   ├── models.py                   # Flight model (pricing, schedules, routes, status)
│   │   ├── serializers.py              # Flight read/write/status serializers
│   │   ├── views.py                    # Flight search, details, and admin flight CRUD
│   │   ├── urls.py                     # /api/flights/* and /api/admin/flights/* routes
│   │   ├── services/
│   │   │   └── flight_tracker.py       # OpenSky Network REST API integration service
│   │   └── management/commands/
│   │       └── seed_data.py            # Seeds 21 Indian flights & 7 demo user accounts
│   │
│   ├── bookings/                       # Bookings & transactional reservation app
│   │   ├── models.py                   # Booking model (seat numbers, cabin class, payment status)
│   │   ├── serializers.py              # Concurrency-safe serializer with select_for_update()
│   │   ├── views.py                    # Booking creation, list, detail, cancel, and stats
│   │   └── urls.py                     # /api/bookings/* and /api/admin/stats/ routes
│   │
│   ├── .env.example                    # Safe template with placeholder values
│   ├── manage.py
│   └── db.sqlite3                      # SQLite development database
│
├── frontend/                           # React 19 + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js               # Axios instance with JWT interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation bar with dynamic auth links
│   │   │   ├── Footer.jsx              # Aviation footer
│   │   │   ├── SeatMapModal.jsx        # Interactive aircraft cabin seat picker
│   │   │   ├── PaymentModal.jsx        # Demo payment gateway simulation
│   │   │   ├── BoardingPassModal.jsx   # Electronic boarding pass with barcode
│   │   │   ├── LiveTelemetryModal.jsx  # OpenSky radar & telemetry display
│   │   │   └── ProtectedRoute.jsx      # Route guard for authenticated & admin users
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global authentication state (JWT decode & storage)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Landing page with search bar & Indian hubs
│   │   │   ├── FlightSearchPage.jsx    # Search results, filtering, & booking flow
│   │   │   ├── LoginPage.jsx           # Sign in page with one-click test credentials
│   │   │   ├── RegisterPage.jsx        # Account registration form
│   │   │   ├── MyTripsPage.jsx         # Customer booking history & cancellation
│   │   │   ├── LiveTrackerPage.jsx     # Radar map & telemetry viewer
│   │   │   └── AdminDashboardPage.jsx  # Admin user approval, flight manager, & analytics
│   │   ├── App.jsx                     # Client routing definitions
│   │   └── main.jsx                    # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── docs/
│   └── screenshots/                    # 9 actual application UI screenshots
├── requirements.txt                    # Backend Python dependencies
├── .gitignore                          # Excludes .env, venv, node_modules, and sqlite
└── README.md
```

---

## ⚙️ Prerequisites

Before getting started, ensure the following software is installed on your workstation:

| Software | Minimum Version | Installation Link |
|---|---|---|
| **Python** | 3.11+ | [python.org/downloads](https://www.python.org/downloads/) |
| **Node.js & npm** | Node 18+ / npm 9+ | [nodejs.org](https://nodejs.org/) |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com/) |
| **PostgreSQL** *(Optional)* | 14+ | [postgresql.org](https://www.postgresql.org/download/) *(Required only for production concurrency testing; SQLite works out-of-the-box)* |
| **Redis** *(Optional)* | 6+ | [redis.io](https://redis.io/download/) *(Required only for Celery worker email execution; console fallback is active by default)* |

---

## 🚀 Backend Setup

### 1. Clone the Repository
```bash
git clone https://github.com/nandana-dinesh/AirBooking.git
cd AirBooking
```

### 2. Create and Activate Virtual Environment

**Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

*(Note: If PowerShell restricts script execution, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once).*

**Windows (Command Prompt):**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate.bat
```

**macOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

When active, your terminal prompt will display `(venv)`.

### 3. Install Python Dependencies
```bash
pip install -r ../requirements.txt
```

### 4. Configure Environment Variables
Copy the template `.env.example` to create your local `.env`:

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**
```bash
cp .env.example .env
```

Generate a secure Django secret key:
```bash
python -c "import secrets; print(secrets.token_hex(50))"
```

Open `backend/.env` in your editor and paste the generated value into `SECRET_KEY=`.

### 5. Configure Database

#### Option A: SQLite (Default — Recommended for Fast Local Setup)
Leave `DATABASE_URL=` empty in your `.env`. Django will automatically create and use `backend/db.sqlite3`.

#### Option B: PostgreSQL (Recommended for Production Concurrency)
If you have PostgreSQL installed:
1. Create the database in `psql`:
   ```sql
   CREATE USER airbooking_user WITH PASSWORD 'your_secure_password';
   CREATE DATABASE airbooking OWNER airbooking_user;
   GRANT ALL PRIVILEGES ON DATABASE airbooking TO airbooking_user;
   ```
2. Set `DATABASE_URL` in `backend/.env`:
   ```env
   DATABASE_URL=postgresql://airbooking_user:your_secure_password@localhost:5432/airbooking
   ```

### 6. Run Migrations & Seed Data
```bash
# Run database migrations
python manage.py migrate

# Seed 21 Indian flights and 7 demo user accounts
python manage.py seed_data
```

### 7. Create Superuser (Optional)
If you wish to create a custom administrator:
```bash
python manage.py createsuperuser
```
*(Pre-seeded administrator credentials are already available: `admin` / `adminpassword123`).*

### 8. Start Django Development Server
```bash
python manage.py runserver 8000
```
Backend API will be accessible at: **`http://127.0.0.1:8000/`**

---

## 💻 Frontend Setup

Open a **separate terminal** and navigate to the `frontend/` directory:

### 1. Install Dependencies
```bash
cd AirBooking/frontend
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```
Frontend application will be accessible at: **`http://localhost:5173/`**

### 3. Build for Production (Verification)
```bash
npm run build
```
Generates production build in `frontend/dist/` with 0 bundle errors.

---

## 🔐 Environment Variables

The project loads environment variables via `python-dotenv` from `backend/.env`. Refer to the schema below:

| Variable | Required | Default Value | Description |
|---|:---:|---|---|
| `SECRET_KEY` | **Yes** | *Fallback dev key* | Cryptographic signing key for sessions and tokens. |
| `DEBUG` | No | `True` | Set to `False` in production environments. |
| `ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Comma-separated list of hostnames served by Django. |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated client origins allowed to access the API. |
| `DATABASE_URL` | No | *Empty (SQLite fallback)* | PostgreSQL URL format: `postgresql://USER:PASSWORD@HOST:5432/DB_NAME`. |
| `EMAIL_BACKEND` | No | `django.core.mail.backends.console.EmailBackend` | Set to SMTP backend for live email delivery. Default prints to console. |
| `CELERY_BROKER_URL` | No | `redis://127.0.0.1:6379/0` | Redis broker URL for Celery asynchronous workers. |
| `CELERY_RESULT_BACKEND` | No | `redis://127.0.0.1:6379/0` | Redis backend URL for Celery task results. |
| `OPENSKY_USERNAME` | No | *Anonymous* | OpenSky Network username for higher API rate limits. |
| `OPENSKY_PASSWORD` | No | *Anonymous* | OpenSky Network password. |

---

## 🏃 Running the Application

| Service | Working Directory | Command | URL |
|---|---|---|---|
| **Backend API** | `backend/` | `python manage.py runserver 8000` | http://127.0.0.1:8000/ |
| **Frontend UI** | `frontend/` | `npm run dev` | http://localhost:5173/ |
| **Django Admin** | — | — | http://127.0.0.1:8000/admin/ |
| **Celery Worker** *(Optional)* | `backend/` | `celery -A config worker --loglevel=info` | — |

---

## 📡 API Endpoints

All RESTful endpoints are prefixed with `/api/`.

### 1. Authentication (`users` app)
| HTTP Method | Endpoint | Access Level | Description |
|:---:|---|:---:|---|
| `POST` | `/api/auth/register/` | Public | Register new customer account (defaults to `pending`). |
| `POST` | `/api/auth/login/` | Public | Authenticate user; returns JWT access and refresh tokens. |
| `POST` | `/api/auth/token/refresh/` | Public | Refresh expired JWT access token. |
| `GET` | `/api/auth/me/` | Authenticated | Retrieve authenticated user profile and role. |

### 2. Flights Catalog & Live Telemetry (`flights` app)
| HTTP Method | Endpoint | Access Level | Description |
|:---:|---|:---:|---|
| `GET` | `/api/flights/search/` | Authenticated | Search flights by `origin`, `destination`, and `date`. |
| `GET` | `/api/flights/<id>/` | Authenticated | Retrieve flight details and real-time seat availability. |
| `GET` | `/api/flights/<id>/live-status/` | Authenticated | Query OpenSky Network telemetry or deterministic estimate. |

### 3. Bookings & Transactions (`bookings` app)
| HTTP Method | Endpoint | Access Level | Description |
|:---:|---|:---:|---|
| `GET` | `/api/bookings/` | Authenticated | List all bookings associated with the current user. |
| `POST` | `/api/bookings/` | Authenticated | Concurrency-safe seat reservation and payment simulation. |
| `GET` | `/api/bookings/<id>/` | Authenticated | Retrieve specific booking confirmation and passenger data. |
| `POST` | `/api/bookings/<id>/cancel/` | Authenticated | Cancel confirmed booking and release seat back to inventory. |

### 4. Admin Management Endpoints
| HTTP Method | Endpoint | Access Level | Description |
|:---:|---|:---:|---|
| `GET` | `/api/admin/users/` | Admin Only | List all registered platform users. |
| `GET` | `/api/admin/users/pending/` | Admin Only | List users awaiting registration approval. |
| `POST` | `/api/admin/users/<id>/approve/` | Admin Only | Approve user and trigger Celery activation email. |
| `POST` | `/api/admin/users/<id>/reject/` | Admin Only | Reject registration and block platform login. |
| `DELETE` | `/api/admin/users/<id>/` | Admin Only | Remove user account from system. |
| `GET` | `/api/admin/flights/` | Admin Only | List all flight records with management metadata. |
| `POST` | `/api/admin/flights/` | Admin Only | Create new flight schedule. |
| `GET` / `PUT` / `DELETE` | `/api/admin/flights/<id>/` | Admin Only | View, update, or delete flight record. |
| `PUT` / `PATCH` | `/api/admin/flights/<id>/status/` | Admin Only | Update flight operational status (`On-Time`, `Delayed`, etc.). |
| `GET` | `/api/admin/stats/` | Admin Only | Platform statistics (total bookings, revenue, top routes). |

---

## 👥 Demo Credentials

The database seeding command (`python manage.py seed_data`) creates **7 development demo accounts**:

| Username | Password | Role | Account Status | Intended Test Purpose |
|---|---|---|:---:|---|
| `admin` | `adminpassword123` | Administrator | ✅ Active | Admin portal, user approvals, flight status editing, analytics |
| `rahul_sharma` | `userpassword123` | Customer | ✅ Approved | Full flight search, seat map, demo checkout, and trip cancellation |
| `john_doe` | `userpassword123` | Customer | ✅ Approved | Standard customer flow verification |
| `ananya_singh` | `userpassword123` | Customer | ✅ Approved | Standard customer flow verification |
| `priya_patel` | `userpassword123` | Customer | ⏳ Pending | Test that unapproved accounts are blocked from logging in |
| `arjun_nair` | `userpassword123` | Customer | ⏳ Pending | Test admin approval workflow |
| `banned_user` | `userpassword123` | Customer | ❌ Rejected | Test that rejected accounts receive authentication failure |

*(Note: On the login page, click any of the **"One-Click Test Accounts"** buttons to populate credentials automatically).*

---

## 🧪 Running Tests

The test suite thoroughly validates authentication, user approval constraints, flight searches, and seat reservation concurrency:

### 1. Execute Django Unit Tests
From the `backend/` directory with `venv` activated:
```powershell
python manage.py test --verbosity=2
```

**Expected Result:**
```
Ran 11 tests in 11.273s
OK
```

### 2. Verify Django System Checks
```powershell
python manage.py check
```
Identifies 0 issues.

### 3. Verify Database Migrations
```powershell
python manage.py migrate --check
```
Confirms all model definitions match database migrations.

---

## 🔍 Known Limitations & Architecture Decisions

To maintain full transparency with evaluators, the following engineering trade-offs and domain limitations are documented:

### 1. Database Concurrency & SQLite Limitations
- **SQLite Behavior:** Django's `select_for_update()` does not perform row-level locking on SQLite. SQLite's lock mechanism operates at the entire database/file level, and SQLite does not support `SELECT ... FOR UPDATE` syntax. Consequently, running concurrent seat booking tests against SQLite will not test true row-level locks.
- **Production Architecture:** For true row-level locking guarantees where multiple concurrent threads attempt to book the same seat, configure **PostgreSQL** by setting `DATABASE_URL` in `.env`. PostgreSQL natively executes `SELECT ... FOR UPDATE` row locks inside `transaction.atomic()`, preventing overbooking.

### 2. OpenSky Network Coverage & Rate Limits
- **Anonymous Rate Limits:** The public OpenSky Network REST API limits anonymous requests to approximately 100 queries per day. Adding `OPENSKY_USERNAME` and `OPENSKY_PASSWORD` to `.env` increases the limit to ~400 requests/day.
- **ADS-B Transponder Availability:** Not all aircraft or low-altitude domestic flights are continuously within range of volunteer ADS-B receivers. When live vectors are unavailable, AirBooking falls back to a deterministic, physics-calibrated **schedule estimate** (bearing, ground speed, and position between airports), which is clearly labeled in the user interface.

### 3. Simulated Payment Gateway
- **Demo Mode:** The checkout workflow is a demo simulation. No real banks, payment gateways (Stripe, Razorpay, etc.), or financial networks are contacted.
- **Data Protection:** Credit card numbers, expiration dates, CVVs, and UPI VPAs entered in the checkout modal are validated in the frontend, but are **never stored** in the database.

### 4. Background Tasks & Celery
- **Redis Dependency:** Background execution of Celery email tasks requires an active Redis service (`redis://127.0.0.1:6379/0`).
- **Development Fallback:** In local environments without Redis, emails gracefully fall back to the Django console backend (`EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`), outputting email content directly to terminal logs without crashing the request cycle.

### 5. Secret Management & Key Rotation
- **Zero Secrets in Repository:** All secrets are strictly decoupled from source control using `.env` files ignored by `.gitignore`.
- **Key Rotation Procedure:** In case of key exposure or scheduled maintenance, generate a new random key with `python -c "import secrets; print(secrets.token_hex(50))"`, update `SECRET_KEY` in `backend/.env`, and restart the Django service.
