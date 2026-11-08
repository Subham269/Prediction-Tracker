# 🏆 PredictionOS — Full-Stack Sports Prediction Tracker

A modern full-stack web platform where sports enthusiasts predict upcoming Cricket and Football matches, lock in their picks before kickoff, earn points, track performance metrics, and compete on a global leaderboard.


---

## ⚡ Key Features

* **🏏 Cricket & ⚽ Football Match Predictions:** Browse upcoming fixtures with team flags, dates, and match kickoff times.
* **⏱️ Match Deadline & Time-Locking System:** Predictions automatically close as soon as the match kickoff time arrives (`Date.now() >= startMs`), both client-side and enforced strictly on the server.
* **🔐 Secure Authentication & Authorization:**
  * User registration and login powered by **bcrypt** password hashing (10 rounds) and **JWT (JSON Web Tokens)** with a 7-day expiration.
  * Client-side **Protected Routes** that guard private pages and automatically trigger the login modal.
  * Context-driven auth modals accessible anywhere across the app.
* **🏆 Global Competitive Leaderboard:**
  * Real-time rankings sorted by points and username.
  * Top-3 medal podium badges (🥇, 🥈, 🥉) and personalized user highlighting.
* **🎯 My Predictions Dashboard:**
  * Complete personal history of pending, winning, and losing picks.
  * Visual status tags displaying match outcome verification (`✓ Correct`, `✗ Incorrect`, or `Locked In`).
* **📈 Real-Time Performance Analytics (Dashboard):**
  * Live accuracy percentages, total picks, resolved matches, current winning streaks, and all-time best streaks.
* **⚖️ Transactional Scoring Engine:**
  * Uses PostgreSQL **ACID transactions (`BEGIN`, `COMMIT`, `ROLLBACK`)** for settling match outcomes.
  * Rewards **+3 points** for correct predictions and applies a **-1 point** penalty for incorrect predictions.
  * Database-level single-settlement guarantee preventing double-scoring.
* **🐳 Docker Multi-Container Architecture:** Production-ready containerization for both Node.js and PostgreSQL with health checks and persistent storage volumes.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React 19 + Vite 8
* **Routing:** React Router v7
* **Styling & UI:** Tailwind CSS v4, Lucide React Icons, Flag Icons (`flag-icons`)
* **Component Primitives:** Radix UI (`@radix-ui`) / Shadcn UI primitives
* **Notifications:** Sonner Toast Notifications
* **Typography:** `@fontsource-variable/geist`

### **Backend**
* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js 5
* **Security & Auth:** JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcrypt`), CORS (`cors`)
* **Environment:** Dotenv (`dotenv`)

### **Database & DevOps**
* **Database:** PostgreSQL 16 (Relational DB with check constraints & identity keys)
* **Client Driver:** `pg` (node-postgres connection pool)
* **Containerization:** Docker & Docker Compose

---

## 🏗️ Architecture & Database Schema

### Database Model:
* **`users`**: Manages credentials (`email`, `username`, `password` hash), registration timestamps, and cumulative `points`.
* **`matches`**: Fixtures with `sport` (`cricket` | `football`), `team1`, `team2`, `match_date`, and `start_time` (checked against regex `^([01][0-9]|2[0-3]):[0-5][0-9]$`).
* **`predictions`**: Relational junction table enforcing `UNIQUE (user_id, match_id)` to prevent duplicate picks per match, storing `predicted_outcome`, `actual_outcome`, and `is_correct`.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+ recommended)
* [PostgreSQL](https://www.postgresql.org/) (v16+) or [Docker Desktop](https://www.docker.com/)

---

### Option 1: Running with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Subham269/Prediction-Tracker.git
   cd Prediction-Tracker
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=postgres://predictionos:devpassword@db:5432/predictionos
   JWT_SECRET=your_super_secret_jwt_key
   VITE_API_URL=http://localhost:3000
   ```

3. **Start the containers:**
   ```bash
   docker compose up --build
   ```
   * Backend will be available at `http://localhost:3000`
   * PostgreSQL will be available at `localhost:5433`

4. **Run the Frontend locally:**
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

### Option 2: Running Locally Without Docker

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database:**
   Create a PostgreSQL database and run the schema:
   ```bash
   psql -U postgres -d prediction_tracker -f backend/schema.sql
   ```

3. **Create `.env` file:**
   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:<your_password>@localhost:5432/prediction_tracker
   JWT_SECRET=your_super_secret_jwt_key
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the Backend:**
   ```bash
   npm run server
   ```

5. **Start the Frontend:**
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | ❌ |
| `GET` | `/api/matches` | Fetch all matches (supports `?sport=cricket` or `?sport=football`) | ❌ |
| `POST` | `/api/matches` | Create a new match fixture | ❌ |
| `GET` | `/api/predictions` | Retrieve predictions for the authenticated user | ✅ |
| `POST` | `/api/predictions` | Submit a match prediction (pre-kickoff only) | ✅ |
| `PATCH` | `/api/predictions/:id` | Resolve match outcome & update player points (+3 / -1) | ✅ |
| `GET` | `/api/leaderboard` | Get the top 20 players ranked by points | ✅ |

---

## 👨‍💻 Author

**Subham Saha**
* LinkedIn: [Subham Saha](https://www.linkedin.com/in/subham-saha-72ab062a3/)
* GitHub: [@Subham269](https://github.com/Subham269)
