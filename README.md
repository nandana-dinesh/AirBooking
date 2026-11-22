# AirBooking — Flight Booking Web Application
> **Full Stack Developer Take-Home Assignment**  
> **Company**: YUAI Soft Solutions Pvt. Ltd.  
> **Position**: Full Stack Engineer (React + Django/DRF)  
> **Author**: Submission Project  

---

## 1. Project Overview

**AirBooking** is a modern, enterprise-grade flight booking and real-time management platform built with **Django REST Framework (DRF)** on the backend and **React 19 + Tailwind CSS** on the frontend. The system implements a robust **User Registration & Admin Approval workflow**, an interactive **Flight Search and Seat Reservation engine**, **Simulated Payment Gateway**, downloadable/printable **Electronic Boarding Passes**, a user **My Trips** management portal, and **Real-Time Flight Telemetry** integrated with the **OpenSky Network ADS-B API**.

---

## 2. Core Value Propositions & Key Highlights

1. **Strict User Approval Gating**:
   - Newly registered user accounts default to `approval_status = 'pending'`.
   - Pending or rejected users are strictly prevented from logging in (`403 Forbidden` with informative feedback).
   - Platform administrators review pending applicants in a dedicated **Admin Portal** to Approve or Reject.
   - Upon approval, an asynchronous **Celery task** dispatches an activation notification email.

2. **Flight Search & Filtering Engine**:
   - Filter flights by origin airport/city, destination, departure date, price range slider, airline, and operational status (`ON_TIME`, `DELAYED`, `BOARDING`).
   - Dynamic sorting by departure time, lowest price, highest price, or duration.

3. **Interactive Aircraft Cabin Seat Selection Map**:
   - Visual 2D aircraft cabin layout displaying Business Class (Rows 1–3) and Economy Class (Rows 4–12).
   - Live seat collision detection: already occupied seats are disabled in real-time, preventing double-bookings with database transaction locks (`select_for_update`).

4. **Realistic Simulated Payment & E-Ticket Boarding Pass**:
   - Embedded 256-bit encrypted simulated card checkout modal with validation and bank processing delays.
   - Generates unique 6-character PNR booking reference (e.g., `AB9482X`).
   - Confetti celebration upon reservation and printable/downloadable **Electronic Boarding Pass** with QR code and barcode.

5. **User "My Trips" Dashboard**:
   - Filter between *Upcoming*, *Past*, and *Cancelled* flights.
   - One-click seat cancellation with automated seat inventory recovery and simulated refund.
   - Re-open and print electronic boarding passes anytime.

6. **Real-Time Flight Status & Radar Telemetry (OpenSky Network)**:
   - Synchronized with OpenSky Network ADS-B stream.
   - Computes real-time flight phase (Climbing, Cruising, Descent, Landed), barometric altitude, true ground speed (knots and km/h), heading compass, and live GPS coordinates.
   - Interactive radar tracker showing the aircraft traveling along its great-circle arc between origin and destination.

7. **Comprehensive Admin Dashboard**:
   - **Pending Approvals Queue**: One-click approve/reject with instant notification.
   - **Flight Management**: Create scheduled flights, adjust prices, and live update flight status (`ON_TIME`, `DELAYED`, `CANCELLED`, `BOARDING`) with custom delay minutes.
   - **User Directory**: Search and filter all registered users by role and status.
   - **Analytics & Metrics**: Real-time revenue analytics, confirmed booking counts, route occupancy rates, and popular routes.

---

## 3. Technology Stack

### Backend
- **Python 3.10+ / Django 5.2**
- **Django REST Framework (DRF 3.18)**
- **Simple JWT (djangorestframework-simplejwt)**: Secure access & refresh token rotation
- **Celery 5.7**: Asynchronous task processing (user approval email notifications)
- **Django CORS Headers**: Configured cross-origin communication
- **Requests**: External OpenSky Network ADS-B API querying
- **SQLite / PostgreSQL ready**: Transaction-safe inventory handling

### Frontend
- **React 19 & Vite 8**
- **Tailwind CSS 3.4**: Modern airline-themed design system
- **Lucide React**: Clean icons
- **Axios**: Configured client with automatic JWT token refresh interceptors
- **React Router DOM 7**: Client routing with role-based and authentication guards
- **Canvas-Confetti**: User celebration effect on booking confirmation

---

## 4. Test Accounts & Admin Credentials

The database comes pre-seeded with accounts for all approval states:

| Role | Username | Password | Status | Notes |
|---|---|---|---|---|
| **System Admin** | `admin` | `adminpassword123` | `approved` | Full administrative access to `/admin-portal` |
| **Approved Customer** | `john_doe` | `userpassword123` | `approved` | Pre-loaded with confirmed trips in "My Trips" |
| **Pending User** | `sarah_connor` | `userpassword123` | `pending` | Used to test the approval workflow |
| **Rejected User** | `banned_user` | `userpassword123` | `rejected` | Blocked from login |

> *Quick Login buttons are also directly embedded on the login page for convenience!*

---

## 5. API Specification

### Authentication Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Public | User registration; creates user with `approval_status='pending'` |
| `POST` | `/api/auth/login/` | Public | Authenticates user; verifies `approval_status == 'approved'`, issues JWT |
| `POST` | `/api/auth/token/refresh/` | Public | Refreshes expired access tokens |
| `GET` | `/api/auth/me/` | Authenticated | Retrieves current authenticated profile |

### Flight Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/flights/search/` | Authenticated | Search & filter flights by origin, destination, date, price, status |
| `GET` | `/api/flights/{id}/` | Authenticated | Flight details including real-time reserved/occupied seat map |
| `GET` | `/api/flights/{id}/live-status/` | Authenticated | Real-time OpenSky telemetry, coordinates, altitude, progress |

### Booking Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings/` | Authenticated | Reserves seats, decrements availability, creates booking |
| `GET` | `/api/bookings/` | Authenticated | Retrieves current user's trips (`?timeframe=upcoming/past` or `?status=CANCELLED`) |
| `GET` | `/api/bookings/{id}/` | Authenticated | Electronic ticket details |
| `POST` | `/api/bookings/{id}/cancel/` | Authenticated | Cancels booking and refunds seats back to inventory |

### Admin Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/users/pending/` | Admin | Retrieves users waiting for approval |
| `POST` | `/api/admin/users/{id}/approve/` | Admin | Approves user and triggers Celery activation email |
| `POST` | `/api/admin/users/{id}/reject/` | Admin | Rejects user application |
| `GET` | `/api/admin/users/` | Admin | Lists all platform users with status/role filters |
| `DELETE` | `/api/admin/users/{id}/` | Admin | Deletes user account |
| `GET` | `/api/admin/flights/` | Admin | Flight management list with occupancy metrics |
| `POST` | `/api/admin/flights/` | Admin | Creates a new flight schedule |
| `PUT` | `/api/admin/flights/{id}/` | Admin | Updates flight information |
| `PUT` | `/api/admin/flights/{id}/status/` | Admin | Updates operational status (On-Time, Delayed, Cancelled) |
| `GET` | `/api/admin/stats/` | Admin | High-level metrics: revenue, bookings, routes, user counts |

---

## 6. Local Setup and Installation Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ and npm**
- **Redis** *(optional, for Celery broker; fallback mode executes smoothly if offline)*

---

### Step 1: Clone and Enter the Project Directory
```bash
git clone <repository-url>
cd airbooking
```

---

### Step 2: Backend Setup (Django + DRF)

1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations:
   ```bash
   python manage.py migrate
   ```

5. Seed database with test users, flights, and sample bookings:
   ```bash
   python manage.py seed_data
   ```

6. *(Optional)* Run backend automated test suite:
   ```bash
   python manage.py test
   ```
   *(All 11 tests verifying authentication gating, bookings, inventory locks, and OpenSky integration pass with 100% success).*

7. Start the Django development server:
   ```bash
   python manage.py runserver 8000
   ```
   The backend API is now live at `http://127.0.0.1:8000/api/`.

---

### Step 3: Frontend Setup (React + Vite)

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application is now running at `http://localhost:5173`.

---

### Step 4: Running Celery Worker (Email Notifications)

The user approval workflow queues account activation emails asynchronously via Celery:
```bash
# In the backend directory with venv activated:
celery -A config worker --loglevel=info
```
> **Note**: For local development convenience, if Redis is not running, the application includes an automatic graceful fallback to direct execution using Django's console email backend (`EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'`), so approval actions never stall or fail! All approval emails will display directly in the Django console.

---

## 7. Step-by-Step Verification Walkthrough

1. **Test User Registration**:
   - Go to `http://localhost:5173/register`
   - Register a new account (e.g., `emily_watson` / `Password123!`)
   - Notice that the account is created with status **Pending**.

2. **Test Login Gating**:
   - Try logging in with `emily_watson` at `/login`.
   - The platform responds with `403 Forbidden`: *"Your account is pending admin approval."*

3. **Test Admin Approval Flow**:
   - Click "Admin Account" quick login (or sign in as `admin` / `adminpassword123`).
   - Navigate to **Admin Portal** -> **Pending Approvals** tab.
   - Find `emily_watson` and click **Approve & Notify**.
   - The account status changes to **Approved**, and the Celery email notification is triggered.

4. **Test Booking Flow**:
   - Sign in as `emily_watson` or `john_doe`.
   - Go to **Find Flights**, filter by price, date, or route (e.g. `DEL` to `BOM`).
   - Click **Book**.
   - Open the **Aircraft Seat Map** and select your preferred seats (e.g. `12A, 12B`).
   - Click **Continue to Simulated Payment**.
   - Review total price with cabin multiplier and click **Pay**.
   - Experience the confetti celebration and view your official **Electronic Boarding Pass** with barcode and PNR!

5. **Test "My Trips" & Cancellation**:
   - Open **My Trips** in the navbar.
   - View your confirmed trip and click **Cancel** to cancel your reservation.
   - Notice the seats are instantly returned to the flight's available inventory and payment is marked **Refunded**.

6. **Test Live Radar (OpenSky Network)**:
   - Click **Live Radar** in the top navbar.
   - Select any flight to observe real-time barometric altitude, ground speed, true heading, coordinates, and live flight progress.

---

## 8. Company & Submission Details
- **Company**: YUAI Soft Solutions Pvt. Ltd.
- **Contact**: yuaisoftsolutions@gmail.com
- **Project Repository Structure**:
  ```
  airbooking/
  ├── backend/
  │   ├── config/             # Django settings, URLs, Celery configuration
  │   ├── users/              # Custom User model, approval workflow, JWT, Celery tasks
  │   ├── flights/            # Flight models, search/filters, OpenSky live tracker
  │   ├── bookings/           # Booking model, seat lock transactions, payment simulation
  │   ├── manage.py
  │   └── requirements.txt
  ├── frontend/
  │   ├── src/
  │   │   ├── api/            # Axios instance with JWT refresh interceptors
  │   │   ├── context/        # AuthContext for session management
  │   │   ├── components/     # SeatMapModal, PaymentModal, BoardingPassModal, LiveTelemetryModal
  │   │   ├── pages/          # Home, FlightSearch, MyTrips, LiveTracker, AdminDashboard
  │   │   └── App.jsx
  │   ├── package.json
  │   └── vite.config.js
  ├── requirements.txt
  └── README.md
  ```
