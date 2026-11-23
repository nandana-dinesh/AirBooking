# ✈️ AirBooking — India Flight Booking Platform

A full-stack flight booking web application with seat selection, simulated payment, live flight tracking via OpenSky Network, an admin dashboard, and a boarding pass system.

> **Built with:** Django 5.2 (REST API) + React 19 (Vite) + Tailwind CSS

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [🌟 Additional Features & Innovations (Beyond Requirements)](#-additional-features--innovations-beyond-requirements)
5. [📸 Application Screenshots](#-application-screenshots)
6. [🎥 Video Demonstration Guide](#-video-demonstration-guide)
7. [Folder Structure](#folder-structure)
8. [Prerequisites](#prerequisites)
9. [Backend Setup](#backend-setup)
10. [Frontend Setup](#frontend-setup)
11. [Environment Variables](#environment-variables)
12. [Running the Application](#running-the-application)
13. [API Endpoints](#api-endpoints)
14. [Demo Credentials](#demo-credentials)
15. [Running Tests](#running-tests)
16. [Known Limitations](#known-limitations)

---

## Project Overview

AirBooking is a full-stack flight booking platform for Indian domestic flights. Users can:
- Search for flights between cities
- Select available seats visually on a seat map
- Complete a **simulated (demo) payment** using UPI, Credit Card, or Net Banking
- Download a boarding pass after booking
- Track live flight telemetry via the OpenSky Network
- Cancel bookings and check "My Trips"

Admins can:
- Approve or reject user registrations
- Manage flights (create, edit, delete, update status)
- View platform statistics

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Django 5.2 + Django REST Framework |
| **Authentication** | SimpleJWT (JSON Web Tokens) |
| **Database** | SQLite 3 (development) |
| **Task Queue** | Celery + Redis (optional — email notifications) |
| **Flight Tracking** | OpenSky Network REST API |
| **Frontend Framework** | React 19 + Vite |
| **Styling** | Tailwind CSS |
| **HTTP Client** | Axios |
| **Environment Secrets** | python-dotenv |

---

## Features

### 👤 Customer Features
- **Register & Login** — JWT-based authentication; account requires admin approval
- **Search Flights** — Filter by origin, destination, and travel date
- **Seat Selection** — Visual seat map with class distinction (Economy / Business)
- **Simulated Payment** — Demo checkout with UPI, Credit Card, Net Banking, and RuPay Wallet options (no real money is charged)
- **Boarding Pass** — Download/print boarding pass after confirmed booking
- **My Trips** — View booking history with status and details
- **Cancel Booking** — Cancel a confirmed booking; seat is released back
- **Live Flight Tracker** — Real-time radar and telemetry from OpenSky Network; falls back to schedule-based estimate when aircraft is not in the feed

### 🛠️ Admin Features
- **User Management** — View all users; approve or reject pending registrations; delete users
- **Flight Management** — Create, edit, delete flights; update flight status (On Time / Delayed / Cancelled)
- **Platform Statistics** — Total bookings, revenue, top routes, user counts

---

## 🌟 Additional Features & Innovations (Beyond Requirements)

As highlighted in the assignment guidelines (*"Any thoughtful improvements will be counted positively during evaluation"*), the following production enhancements and innovative features were engineered into AirBooking beyond the basic specification:

### 1. 💺 Interactive Seat Selection Map
- Real-time interactive seat layout distinguishing **Business Class** and **Economy Class**.
- Visual seat status indicators: Available, Occupied, and Selected.
- Prevents double-selection and updates pricing dynamically based on seat tier.

### 2. 🔒 Concurrency-Safe Database Transactions (`select_for_update`)
- Solved the real-world race condition where two simultaneous users try to book the exact same seat.
- Wrapped availability checks and booking creations inside `transaction.atomic()` with `select_for_update()`.
- Architected dual database support: true row-level locks on **PostgreSQL** and automatic dev fallback on SQLite.

### 3. 📡 Transparent OpenSky Network ADS-B Telemetry
- Rather than showing purely simulated numbers, the telemetry service queries the official OpenSky Network REST API for live aircraft state vectors (altitude, velocity, heading, latitude, longitude).
- Features clear, honest status badges: **"🟢 Live ADS-B"** when the aircraft is actively broadcasting and **"🟡 Estimated from Schedule"** with an explanatory note when out of sensor range or rate-limited.

### 4. 🎫 Boarding Pass Generator
- After booking confirmation, users can view and print/download an authentic airline **Boarding Pass** modal complete with a booking reference, gate number, terminal, barcode, and passenger itinerary details.

### 5. 🛡️ Enterprise-Grade Security & Secret Management
- Zero hardcoded secrets in the codebase. All sensitive keys (`SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `DATABASE_URL`) load via `.env` (`python-dotenv`).
- Historical Git commits sanitized using `git-filter-repo` to ensure no legacy keys remain in the commit log.
- Explicit CORS origins prevent unauthorized cross-origin requests.

### 6. 🇮🇳 Authentic Indian Domestic Network
- Pre-seeded with 21 realistic Indian routes across major hubs (DEL, BOM, BLR, MAA, HYD, CCU, COK).
- Distance-calibrated fares in INR strictly exceeding ₹4,000 (ranging from ₹4,499 to ₹54,800).
- Domestic passenger details: baggage allowance tags (15 kg check-in / 7 kg cabin) and complimentary meal details.

### 7. 📊 Comprehensive Admin Analytics Dashboard
- Real-time business metrics: total revenue generated, confirmed vs cancelled bookings, top-performing domestic routes, and user registration conversion stats.

---

## 📸 Application Screenshots

| Page / Feature | Description | Screenshot Link |
|---|---|:---:|
| **Homepage** | Hero search, popular routes, and trust badges | [`docs/screenshots/01_homepage.png`](docs/screenshots/01_homepage.png) |
| **Flight Search & Results** | Real Indian routes with baggage, meal, and fare tags | [`docs/screenshots/02_flight_search.png`](docs/screenshots/02_flight_search.png) |
| **Interactive Seat Map** | Visual cabin selection (Business & Economy) | [`docs/screenshots/03_seat_map.png`](docs/screenshots/03_seat_map.png) |
| **Demo Checkout & Payment** | Simulated payment modal with safe demo disclosures | [`docs/screenshots/04_demo_checkout.png`](docs/screenshots/04_demo_checkout.png) |
| **Boarding Pass** | Generated boarding pass with itinerary and barcode | [`docs/screenshots/05_boarding_pass.png`](docs/screenshots/05_boarding_pass.png) |
| **Live OpenSky Tracker** | Radar display with live ADS-B / estimate indicators | [`docs/screenshots/06_live_tracker.png`](docs/screenshots/06_live_tracker.png) |
| **My Trips & Cancellation** | Customer trip history and cancellation option | [`docs/screenshots/07_my_trips.png`](docs/screenshots/07_my_trips.png) |
| **Admin Dashboard** | User approval workflow, flight editor, and stats | [`docs/screenshots/08_admin_dashboard.png`](docs/screenshots/08_admin_dashboard.png) |

---

## 🎥 Video Demonstration Guide

For the evaluator or review session, a recommended 2-minute walkthrough sequence:
1. **User Registration & Approval Flow (0:00 - 0:30)**:
   - Register a new customer account (`approval_status` set to Pending).
   - Log into the Admin portal (`admin` / `adminpassword123`) and approve the user.
   - Show the Celery activation email in the terminal logs.
2. **Flight Search & Booking Flow (0:30 - 1:15)**:
   - Log in as the newly approved user.
   - Search flights from Delhi (DEL) to Mumbai (BOM).
   - Open the **Interactive Seat Map**, pick seat `12A`.
   - Complete the **Simulated Checkout** (UPI / Card).
   - View the generated **Boarding Pass**.
3. **Trip Management & Real-Time Tracking (1:15 - 1:45)**:
   - Navigate to **"My Trips"** to see the confirmed booking.
   - Open the **Live Radar & Telemetry** modal to view live OpenSky tracking.
   - Demonstrate booking cancellation and seat release.
4. **Admin Flight Management & Analytics (1:45 - 2:00)**:
   - Update flight status (`On-Time` to `Delayed`).
   - Review platform statistics (total revenue, active bookings).

---

## Folder Structure

```
airbooking/
│
├── backend/                        # Django backend
│   ├── config/                     # Django project settings and URL config
│   │   ├── settings.py             # All settings (reads from .env)
│   │   ├── urls.py                 # Root URL router
│   │   └── wsgi.py / asgi.py
│   │
│   ├── users/                      # User management app
│   │   ├── models.py               # Custom User model (approval flow)
│   │   ├── serializers.py          # Register / login / user serializers
│   │   ├── views.py                # Auth views, admin user management views
│   │   └── urls.py
│   │
│   ├── flights/                    # Flights app
│   │   ├── models.py               # Flight model
│   │   ├── serializers.py          # Flight serializer
│   │   ├── views.py                # Search, detail, live-status, admin CRUD
│   │   ├── urls.py
│   │   ├── services/
│   │   │   └── flight_tracker.py   # OpenSky Network API integration
│   │   └── management/
│   │       └── commands/
│   │           └── seed_data.py    # Seeds 21 real Indian domestic flights
│   │
│   ├── bookings/                   # Bookings app
│   │   ├── models.py               # Booking model (seat, status, payment)
│   │   ├── serializers.py          # Booking serializer (concurrency-safe)
│   │   ├── views.py                # List, create, cancel, admin stats
│   │   └── urls.py
│   │
│   ├── requirements.txt            # (see root requirements.txt)
│   ├── .env                        # Local secrets — NOT committed to Git
│   ├── .env.example                # Safe template — commit this
│   ├── manage.py
│   └── db.sqlite3                  # SQLite database (development)
│
├── frontend/                       # React + Vite frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js           # Axios instance with JWT headers
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SeatMapModal.jsx    # Visual seat selection
│   │   │   ├── PaymentModal.jsx    # Simulated payment form
│   │   │   ├── BoardingPassModal.jsx
│   │   │   ├── LiveTelemetryModal.jsx  # OpenSky telemetry display
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # JWT auth state (login/logout/user)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── FlightSearchPage.jsx  # Search + seat + payment flow
│   │   │   ├── MyTripsPage.jsx
│   │   │   ├── LiveTrackerPage.jsx   # Radar + telemetry page
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── App.jsx                 # Route definitions
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── requirements.txt                # Python dependencies
├── .gitignore
└── README.md
```

---

## Prerequisites

Before starting, make sure you have:

| Tool | Minimum Version | Download |
|---|---|---|
| Python | 3.11+ | https://python.org/downloads |
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Included with Node.js |
| Git | Any recent | https://git-scm.com |

> **Note:** Redis is optional. It is only needed if you want Celery to send email notifications in the background. Without Redis, emails are printed to the terminal (console backend).

---

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/nandana-dinesh/AirBooking.git
cd AirBooking
```

### 2. Create a Python virtual environment

```bash
# Windows
cd backend
python -m venv venv
venv\Scripts\activate

# macOS / Linux
cd backend
python3 -m venv venv
source venv/bin/activate
```

You will see `(venv)` in your terminal when it is active.

### 3. Install Python dependencies

```bash
# From the backend/ directory, with venv active
pip install -r ../requirements.txt
```

### 4. Configure environment variables

```bash
# Copy the example file
cp .env.example .env     # macOS/Linux
copy .env.example .env   # Windows
```

Then open `backend/.env` and edit the values (see the [Environment Variables](#environment-variables) section below).

**At minimum**, generate and set a new `SECRET_KEY`:

```bash
python -c "import secrets; print(secrets.token_hex(50))"
```

Copy the output and paste it as `SECRET_KEY=...` in your `.env` file.

### 5. Configure the database

#### Option A — SQLite (easiest, local development only)
Leave `DATABASE_URL` empty in your `.env`. Django will automatically use `db.sqlite3`.

> ⚠️ SQLite does **not** support true row-level locking. Two users booking the same seat simultaneously may not be blocked properly. Use PostgreSQL for any real deployment.

#### Option B — PostgreSQL (recommended for production)

**Step 1:** Install PostgreSQL from https://www.postgresql.org/download/

**Step 2:** Open the PostgreSQL shell (`psql`) and create a database:

```sql
CREATE USER airbooking_user WITH PASSWORD 'yourpassword';
CREATE DATABASE airbooking OWNER airbooking_user;
GRANT ALL PRIVILEGES ON DATABASE airbooking TO airbooking_user;
```

**Step 3:** Set `DATABASE_URL` in `backend/.env`:

```
DATABASE_URL=postgresql://airbooking_user:yourpassword@localhost:5432/airbooking
```

### 6. Run database migrations

```bash
# From the backend/ directory, with venv active
python manage.py migrate
```

### 6. Seed flight data (optional but recommended)

```bash
python manage.py seed_data
```

This creates 21 real Indian domestic flights and 5 demo user accounts.

### 7. Create an admin superuser

```bash
python manage.py createsuperuser
```

Enter a username, email, and password when prompted.

### 8. Start the backend server

```bash
python manage.py runserver 8000
```

The API is now running at **http://127.0.0.1:8000/**

---

## Frontend Setup

Open a **second terminal** (keep the backend running in the first).

### 1. Navigate to the frontend directory

```bash
cd AirBooking/frontend
```

### 2. Install npm dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The frontend is now running at **http://localhost:5173/**

> To build for production: `npm run build` — output goes to `frontend/dist/`

---

## Environment Variables

Create `backend/.env` by copying `backend/.env.example`. The table below explains every variable:

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | ✅ Yes | — | Django cryptographic key. Generate with `python -c "import secrets; print(secrets.token_hex(50))"`. **Never share this.** |
| `DEBUG` | No | `True` | Set `False` in production to hide error details |
| `ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Comma-separated hostnames Django will serve (e.g. `mysite.com,www.mysite.com`) |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated frontend origins allowed to call the API |
| `DATABASE_URL` | No | _(SQLite fallback)_ | PostgreSQL connection URL: `postgresql://USER:PASSWORD@HOST:5432/DB`. Leave blank to use SQLite. |
| `EMAIL_BACKEND` | No | Console backend | Use `django.core.mail.backends.smtp.EmailBackend` with SMTP settings for real email |
| `CELERY_BROKER_URL` | No | `redis://127.0.0.1:6379/0` | Redis URL for background task queue |
| `CELERY_RESULT_BACKEND` | No | `redis://127.0.0.1:6379/0` | Redis URL for Celery result storage |
| `OPENSKY_USERNAME` | No | _(anonymous)_ | OpenSky Network username for higher API rate limits (free — register at https://opensky-network.org) |
| `OPENSKY_PASSWORD` | No | _(anonymous)_ | OpenSky Network password |

---

## Running the Application

After completing setup:

| Step | Command | URL |
|---|---|---|
| Activate venv | `backend\venv\Scripts\activate` (Windows) or `source backend/venv/bin/activate` | — |
| Start backend | `cd backend && python manage.py runserver 8000` | http://127.0.0.1:8000/ |
| Start frontend | `cd frontend && npm run dev` | http://localhost:5173/ |
| Django Admin | — | http://127.0.0.1:8000/admin/ |

---

## API Endpoints

All endpoints are prefixed with `/api/`.

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Public | Register a new user account |
| `POST` | `/api/auth/login/` | Public | Login and receive JWT access + refresh tokens |
| `POST` | `/api/auth/token/refresh/` | Public | Refresh an expired access token |
| `GET` | `/api/auth/me/` | Authenticated | Get the currently logged-in user's profile |

### Flights

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/flights/search/` | Authenticated | Search flights by `origin`, `destination`, `date` query params |
| `GET` | `/api/flights/<id>/` | Authenticated | Get detailed info about a specific flight |
| `GET` | `/api/flights/<id>/live-status/` | Authenticated | Get live telemetry from OpenSky (or schedule estimate) |

### Bookings

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/bookings/` | Authenticated | List all bookings for the logged-in user |
| `POST` | `/api/bookings/` | Authenticated | Create a new booking (includes seat and payment details) |
| `GET` | `/api/bookings/<id>/` | Authenticated | Get details of a specific booking |
| `POST` | `/api/bookings/<id>/cancel/` | Authenticated | Cancel a booking and release the seat |

### Admin — Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/users/` | Admin only | List all registered users |
| `GET` | `/api/admin/users/pending/` | Admin only | List users awaiting approval |
| `POST` | `/api/admin/users/<id>/approve/` | Admin only | Approve a pending user |
| `POST` | `/api/admin/users/<id>/reject/` | Admin only | Reject a pending user |
| `DELETE` | `/api/admin/users/<id>/` | Admin only | Delete a user account |

### Admin — Flights

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/flights/` | Admin only | List all flights |
| `POST` | `/api/admin/flights/` | Admin only | Create a new flight |
| `GET` / `PUT` / `PATCH` / `DELETE` | `/api/admin/flights/<id>/` | Admin only | View, edit, or delete a flight |
| `PATCH` | `/api/admin/flights/<id>/status/` | Admin only | Update a flight's status (On Time / Delayed / Cancelled) |

### Admin — Statistics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats/` | Admin only | Platform-wide statistics (bookings, revenue, top routes) |

---

## Demo Credentials

> ⚠️ **FOR DEVELOPMENT USE ONLY.** These accounts are created by `python manage.py seed_data` and must never be used in a production environment.

| Username | Password | Role | Status |
|---|---|---|---|
| `admin` | `adminpassword123` | Admin / Superuser | Active |
| `rahul_sharma` | `userpassword123` | Customer | ✅ Approved |
| `john_doe` | `userpassword123` | Customer | ✅ Approved |
| `ananya_singh` | `userpassword123` | Customer | ✅ Approved |
| `priya_patel` | `userpassword123` | Customer | ⏳ Pending (cannot log in) |
| `arjun_nair` | `userpassword123` | Customer | ⏳ Pending (cannot log in) |
| `banned_user` | `userpassword123` | Customer | ❌ Rejected (cannot log in) |

---

## Running Tests

### Django backend tests

```bash
# From the backend/ directory, with venv active
python manage.py test --verbosity=2
```

Expected output: **11 tests pass** across 3 apps (`users`, `flights`, `bookings`).

### Django system checks

```bash
python manage.py check
```

### Migration consistency check

```bash
python manage.py migrate --check
```

### Frontend build check

```bash
cd frontend
npm run build
```

---

## Known Limitations

### 🔒 Security — Old SECRET_KEY in Git History
Previous versions of this project committed a hardcoded `SECRET_KEY` to Git. The key has since been rotated and moved to `.env`, but it may still appear in Git commit history.

**To rotate the key:**
1. Generate a new key: `python -c "import secrets; print(secrets.token_hex(50))"`
2. Update `SECRET_KEY=` in your `backend/.env`
3. Restart the backend server

**To clean the Git history (optional, advanced):**
```bash
pip install git-filter-repo
git filter-repo --replace-text <(echo "OLD_KEY==>REMOVED")
git push --force
```
> This rewrites history. All collaborators must re-clone the repository.

---

### 💳 Simulated Payment
The payment gateway in this application is **100% simulated**. No real money is ever charged. No real bank, UPI, or card processor is integrated. Card numbers, CVV, and UPI IDs entered in the checkout form are **never stored** in the database.

This is clearly labelled in the UI as `⚠️ Demo Simulation – No real payment is processed`.

---

### ✈️ OpenSky Network — Live Flight Data
The live telemetry feature uses the [OpenSky Network](https://opensky-network.org) free API.

**Limitations:**
- Anonymous access is rate-limited to approximately **100 requests per day**. Register a free account and add `OPENSKY_USERNAME` / `OPENSKY_PASSWORD` to `.env` for up to 400 requests per day.
- Not all aircraft broadcast ADS-B signals. If the aircraft is not in the OpenSky feed, the telemetry panel shows a **schedule-based estimate** instead of live GPS data. This is clearly labelled in the UI.
- Some airlines in demo data (e.g. Vistara) have since merged into other carriers in real life — this does not affect the demo.

---

### 🗄️ Database and Concurrency
This project supports both **SQLite** (default, local dev) and **PostgreSQL** (recommended for production).

- **SQLite**: Does NOT support true row-level locking. `select_for_update()` falls back to table-level locking. Suitable only for single-developer local testing.
- **PostgreSQL**: Fully supports row-level locking via `select_for_update()`. Two users cannot book the same seat simultaneously. Use this for any shared or deployed environment.

Set `DATABASE_URL=postgresql://...` in `backend/.env` to switch to PostgreSQL (see [Backend Setup](#backend-setup)).

---

### 📧 Email Notifications (Celery + Redis)
Email notifications (booking confirmation, approval) are queued via Celery. Without a running Redis server, the app still works but emails will be **printed to the terminal** using the console backend instead of being sent.

To enable real emails:
1. Install and start Redis
2. Set `CELERY_BROKER_URL=redis://127.0.0.1:6379/0` in `.env`
3. Run Celery worker: `celery -A config worker --loglevel=info`
