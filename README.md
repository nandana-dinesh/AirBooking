# AirBooking India — Flight Booking & Real-Time Flight Radar Platform

AirBooking India is a flight booking and live aviation tracking platform tailored for Indian domestic and international travellers. Built with a robust **Django REST Framework (DRF)** backend and a reactive **React 19 + Tailwind CSS** frontend, the platform features **verified user approval workflows**, **live aircraft cabin seat maps**, **UPI / RuPay simulated payments**, **printable electronic boarding passes**, and **real-time transponder tracking (OpenSky Network ADS-B telemetry)**.

---

## 1. Key Platform Features

1. **Tailored for Indian Travellers**:
   - Indian domestic and international sectors: New Delhi (`DEL`), Mumbai (`BOM`), Bengaluru (`BLR`), Goa (`GOI` / `GOX`), Kochi (`COK`), Hyderabad (`HYD`), Chennai (`MAA`), Kolkata (`CCU`), Dubai (`DXB`), Singapore (`SIN`).
   - Premier airline partners: **IndiGo**, **Air India**, **Vistara**, **Akasa Air**, **Air India Express**, **Emirates**, **Singapore Airlines**.
   - Indian Rupee (**₹ / INR**) pricing throughout search, seat pricing, booking totals, and boarding passes.
   - Payment options: **UPI (Google Pay, PhonePe, Paytm, BHIM)**, **RuPay / Debit / Credit Cards**, and **NetBanking (SBI, HDFC, ICICI, Axis)**.

2. **User Registration & Security Approval Workflow**:
   - New user registrations default to `approval_status = 'pending'`.
   - Pending or rejected users are blocked from logging in (`403 Forbidden` with informative feedback).
   - Dedicated **Admin Console** allows operations managers to review registrations, approve, or reject applicants.
   - Upon approval, an asynchronous **Celery task** dispatches an activation notification email (with automatic fallback to console output).

3. **Interactive Aircraft Seat Selection**:
   - 2D aircraft cabin layout displaying Business Class (Rows 1–3) and Economy Class (Rows 4–12).
   - Real-time seat collision avoidance: occupied seats are locked and disabled, backed by database concurrency transactions (`select_for_update`).

4. **Electronic Boarding Pass (DGCA Compliant)**:
   - Automated 6-character PNR generation (e.g., `AB9482X`).
   - Instant printable/downloadable Electronic Boarding Pass with QR code, terminal, gate, and seat numbers.

5. **"My Trips" Passenger Management**:
   - View upcoming, past, and cancelled itineraries.
   - One-click seat cancellation with automated seat recovery back to airline inventory and simulated refund.

6. **Live Radar & Telemetry (OpenSky Network ADS-B Stream)**:
   - Real-time flight tracking across Indian airspace and international corridors.
   - Computes flight phase (Climbing, Cruising, Descent, Landed), barometric altitude, true ground speed (knots & km/h), heading compass, and live GPS coordinates.

7. **Central Operations Console**:
   - Review pending user approvals.
   - Manage flight schedules and update operational statuses (`ON_TIME`, `DELAYED`, `CANCELLED`, `BOARDING`) with custom delay minutes.
   - Real-time analytics: Gross bookings value, confirmed PNR counts, route occupancy, and top Indian sectors.

---

## 2. Test Accounts & Admin Credentials

| Role | Username | Password | Status | Notes |
|---|---|---|---|---|
| **System Admin** | `admin` | `adminpassword123` | `approved` | Access to Central Aviation Console (`/admin-portal`) |
| **Approved Passenger** | `rahul_sharma` | `userpassword123` | `approved` | Indian passenger account pre-loaded with bookings |
| **Alternative Customer** | `john_doe` | `userpassword123` | `approved` | Pre-loaded with confirmed trips in "My Trips" |
| **Pending User** | `priya_patel` | `userpassword123` | `pending` | Used to test the approval & notification workflow |
| **Rejected Account** | `banned_user` | `userpassword123` | `rejected` | Blocked from login |

> *One-click demo buttons are provided on the Sign In page for instant testing.*

---

## 3. Technology Stack

- **Backend**: Python 3.10+, Django 5.2, Django REST Framework 3.18, SimpleJWT, Celery 5.7, SQLite / PostgreSQL ready.
- **Frontend**: React 19, Vite 8, Tailwind CSS 3.4, Lucide Icons, Axios, React Router 7, Canvas-Confetti.
- **External Feeds**: OpenSky Network ADS-B API.

---

## 4. Quick Start & Setup Instructions

### 1. Start the Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```
API runs at `http://127.0.0.1:8000/api/`.

### 2. Start the Frontend
In a second terminal:
```powershell
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Run Automated Tests
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py test
```
All 11 unit tests pass with 100% success.
