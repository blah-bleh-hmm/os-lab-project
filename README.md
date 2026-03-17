# CPU Scheduling Visualizer

A full-stack web application that simulates and visualizes CPU scheduling algorithms. Input processes, select algorithms, view animated Gantt charts, compare performance metrics side-by-side, and export results as PDF or JSON.

Built with **React 18** + **Vite** on the frontend and **Express.js** + **MongoDB** on the backend.

---

## Table of Contents

- [Features](#features)
- [Supported Algorithms](#supported-algorithms)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [License](#license)

---

## Features

- **Interactive Process Input** — Add, edit, and remove processes with arrival time and burst time via an inline editable table with real-time validation.
- **4 Scheduling Algorithms** — FCFS, SJF, LJF, and Round Robin (with configurable time quantum).
- **Animated Gantt Charts** — Fully custom-built (no charting library) with staggered block reveal animations, shimmer effects, color-coded process blocks, idle-time striping, auto-scroll, and a labeled time axis.
- **Detailed Per-Process Metrics** — Start time, completion time, turnaround time, waiting time, and response time for every process.
- **Aggregate Metrics** — Average waiting time, average turnaround time, average response time, throughput, CPU utilization, and total completion time.
- **Algorithm Comparison** — Side-by-side metrics table with automatic best-value highlighting, a CPU utilization line chart, and a Gantt chart comparison grid.
- **Best Algorithm Detection** — Automatically scores and ranks algorithms across 5 metrics to declare a winner.
- **Export to PDF** — Multi-page report with input processes, comparison table, best algorithm summary, and per-algorithm detail tables (via jsPDF + jspdf-autotable).
- **Export to JSON** — Download all processes and results as a structured JSON file.
- **Dark / Light Theme** — Full dual-theme support with CSS custom properties. Respects system preference on first visit and persists the choice to `localStorage`.
- **Responsive Design** — Mobile-friendly layout with breakpoints at 640px and 860px.
- **Stepper Navigation** — 4-step wizard flow (Processes → Algorithms → Results → Compare) with visual progress indicators.

---

## Supported Algorithms

| Algorithm                         | Type           | Description                                                                                                                                                             |
| --------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FCFS** (First Come First Serve) | Non-preemptive | Processes are executed in the order they arrive. Simple and fair, but susceptible to the convoy effect.                                                                 |
| **SJF** (Shortest Job First)      | Non-preemptive | Selects the process with the smallest burst time among those that have arrived. Optimal for minimizing average waiting time, but can starve long processes.             |
| **LJF** (Longest Job First)       | Non-preemptive | Selects the process with the largest burst time among those that have arrived. Useful as a comparison baseline; tends to maximize average waiting time.                 |
| **Round Robin**                   | Preemptive     | Each process gets a fixed time quantum. After the quantum expires, the process is preempted and placed at the back of the ready queue. Fair with bounded response time. |

---

## Screenshots

> _Add screenshots of each step here._

| Step                       | Description                                                                            |
| -------------------------- | -------------------------------------------------------------------------------------- |
| **1. Process Input**       | Editable table for entering process IDs, arrival times, and burst times                |
| **2. Algorithm Selection** | Color-coded algorithm cards with multi-select and time quantum config                  |
| **3. Results**             | Per-algorithm metrics cards, data tables, and animated Gantt charts                    |
| **4. Comparison**          | Side-by-side metrics, CPU utilization chart, Gantt comparison grid, and export buttons |

---

## Tech Stack

### Frontend

| Technology                                                                                                        | Purpose                    |
| ----------------------------------------------------------------------------------------------------------------- | -------------------------- |
| [React 18](https://react.dev/)                                                                                    | UI library                 |
| [Vite 5](https://vitejs.dev/)                                                                                     | Build tool and dev server  |
| [React Router v6](https://reactrouter.com/)                                                                       | Client-side routing        |
| [Recharts](https://recharts.org/)                                                                                 | CPU utilization line chart |
| [jsPDF](https://github.com/parallax/jsPDF) + [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) | PDF report generation      |
| CSS Custom Properties                                                                                             | Theming (dark/light mode)  |
| [Inter](https://rsms.me/inter/)                                                                                   | UI font (via Google Fonts) |

### Backend

| Technology                                     | Purpose                         |
| ---------------------------------------------- | ------------------------------- |
| [Node.js](https://nodejs.org/)                 | Runtime                         |
| [Express.js 4](https://expressjs.com/)         | REST API framework              |
| [Mongoose 8](https://mongoosejs.com/)          | MongoDB ODM                     |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud database                  |
| [dotenv](https://github.com/motdotla/dotenv)   | Environment variable management |
| [cors](https://github.com/expressjs/cors)      | Cross-origin resource sharing   |
| [nodemon](https://nodemon.io/)                 | Dev server auto-restart         |

---

## Project Structure

```
cpu-scheduler/
├── backend/
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Environment variables (PORT, MONGODB_URI)
│   ├── package.json
│   ├── config/
│   │   └── db.js                    # MongoDB/Mongoose connection
│   ├── models/
│   │   └── ProcessSet.js            # Mongoose schema for process sets
│   ├── controllers/
│   │   └── schedulerController.js   # Request handlers (validation + orchestration)
│   ├── routes/
│   │   └── schedulerRoutes.js       # Route definitions (/api/processes, /api/schedule)
│   └── services/
│       ├── fcfs.js                  # First Come First Serve implementation
│       ├── sjf.js                   # Shortest Job First implementation
│       ├── ljf.js                   # Longest Job First implementation
│       └── roundRobin.js            # Round Robin implementation
│
├── frontend/
│   ├── index.html                   # HTML shell (loads Inter font, mounts React)
│   ├── vite.config.js               # Vite config (port 3000, API proxy to :6000)
│   ├── package.json
│   └── src/
│       ├── main.jsx                 # App entry (providers + router)
│       ├── App.jsx                  # Root component with route definitions
│       ├── index.css                # Global styles, CSS variables, theme tokens
│       ├── App.css                  # Layout styles
│       ├── api/
│       │   └── schedulerApi.js      # API client (fetch-based)
│       ├── context/
│       │   ├── SchedulerContext.jsx  # Global state (useReducer) for processes & results
│       │   └── ThemeContext.jsx      # Dark/light theme state (localStorage-backed)
│       ├── components/
│       │   ├── Navbar.jsx           # Top nav with stepper + theme toggle
│       │   ├── GanttChart.jsx       # Custom animated Gantt chart
│       │   ├── CPUUtilizationChart.jsx  # Recharts line chart
│       │   └── styles/
│       │       ├── Navbar.css
│       │       ├── GanttChart.css
│       │       └── CPUUtilizationChart.css
│       └── pages/
│           ├── ProcessInput.jsx     # Step 1: Enter processes
│           ├── AlgorithmSelection.jsx # Step 2: Pick algorithms
│           ├── Results.jsx          # Step 3: View results
│           ├── Comparison.jsx       # Step 4: Compare & export
│           └── styles/
│               ├── ProcessInput.css
│               ├── AlgorithmSelection.css
│               ├── Results.css
│               └── Comparison.css
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas** account (or a local MongoDB instance) — [Sign up](https://www.mongodb.com/atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cpu-scheduler
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

**Backend** — Create a `.env` file inside the `backend/` directory:

```env
PORT=6000
MONGODB_URI=your_mongodb_connection_string_here
CLIENT_URL=https://your-frontend-domain.vercel.app
```

| Variable       | Description                                          | Default |
| -------------- | ---------------------------------------------------- | ------- |
| `PORT`         | Port for the Express server                          | `6000`  |
| `MONGODB_URI`  | MongoDB connection string (Atlas or local)           | —       |
| `CLIENT_URL`   | Frontend origin allowed by CORS (for production)     | `*`     |

**Frontend** — Create a `.env` file inside the `frontend/` directory (only needed for production):

```env
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

| Variable       | Description                                          | Default |
| -------------- | ---------------------------------------------------- | ------- |
| `VITE_API_URL` | Backend API base URL (for production)                | `/api`  |

> **Note:** In local development, no frontend `.env` is needed — the Vite dev server proxies `/api` requests to `http://localhost:6000` automatically.

### Running the App

You need **two terminals** — one for the backend and one for the frontend.

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev        # starts with nodemon (auto-reload)
# or
npm start          # starts with node (no auto-reload)
```

The API server starts at `http://localhost:6000`.

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

The frontend dev server starts at `http://localhost:3000`. API requests to `/api/*` are automatically proxied to the backend at port 6000.

Open your browser and navigate to **http://localhost:3000**.

### Production Build

```bash
cd frontend
npm run build      # outputs to frontend/dist/
npm run preview    # preview the production build locally
```

---

## API Reference

All endpoints are prefixed with `/api`. The backend runs on port `6000` by default.

### Health Check

```
GET /
```

**Response:**

```json
{ "message": "CPU Scheduler API is running" }
```

---

### Save Processes

```
POST /api/processes
```

Saves a set of processes to the database.

**Request Body:**

```json
{
  "processes": [
    { "processId": "P1", "arrivalTime": 0, "burstTime": 5 },
    { "processId": "P2", "arrivalTime": 2, "burstTime": 3 },
    { "processId": "P3", "arrivalTime": 4, "burstTime": 1 }
  ]
}
```

**Validation Rules:**

- `processes` must be a non-empty array
- Each process must have `processId` (string), `arrivalTime` (>= 0), and `burstTime` (>= 1)
- No duplicate `processId` values

**Response (201):**

```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "processes": [ ... ]
}
```

---

### Get Processes

```
GET /api/processes/:id
```

Retrieves a previously saved process set by its MongoDB ObjectId.

**Response (200):**

```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "processes": [ ... ]
}
```

---

### Run Scheduling Algorithms

```
POST /api/schedule
```

Runs one or more scheduling algorithms on a set of processes.

**Request Body:**

```json
{
  "processSetId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "algorithms": ["FCFS", "SJF", "Round Robin"],
  "timeQuantum": 3
}
```

| Field          | Type     | Required                             | Description                                                           |
| -------------- | -------- | ------------------------------------ | --------------------------------------------------------------------- |
| `processSetId` | string   | One of `processSetId` or `processes` | Reference to a saved process set                                      |
| `processes`    | array    | One of `processSetId` or `processes` | Inline process array                                                  |
| `algorithms`   | string[] | Yes                                  | Array of algorithm names: `"FCFS"`, `"SJF"`, `"LJF"`, `"Round Robin"` |
| `timeQuantum`  | number   | If Round Robin selected              | Time quantum (>= 1)                                                   |

**Response (200):**

```json
{
  "results": [
    {
      "algorithm": "FCFS",
      "processResults": [
        {
          "processId": "P1",
          "arrivalTime": 0,
          "burstTime": 5,
          "startTime": 0,
          "completionTime": 5,
          "turnaroundTime": 5,
          "waitingTime": 0,
          "responseTime": 0
        }
      ],
      "ganttChart": [
        { "processId": "P1", "start": 0, "end": 5 },
        { "processId": "P2", "start": 5, "end": 8 }
      ],
      "averages": {
        "avgWaitingTime": 2.33,
        "avgTurnaroundTime": 5.33,
        "avgResponseTime": 2.33
      },
      "throughput": 0.375,
      "cpuUtilization": 100.0,
      "totalCompletionTime": 8
    }
  ]
}
```

---

## How It Works

The application follows a **4-step wizard flow**:

### Step 1 — Process Input (`/`)

The user enters a list of processes, each with:

- **Process ID** — A unique identifier (e.g., P1, P2)
- **Arrival Time** — When the process arrives in the ready queue (>= 0)
- **Burst Time** — CPU time required to complete the process (>= 1)

Processes are validated client-side and then persisted to MongoDB via `POST /api/processes`.

### Step 2 — Algorithm Selection (`/algorithms`)

The user selects one or more scheduling algorithms from 4 color-coded cards. If Round Robin is selected, a time quantum input appears (default: 2).

The selections are sent to `POST /api/schedule`, which runs each algorithm server-side and returns the results.

### Step 3 — Results (`/results`)

For each selected algorithm, the app displays:

- **6 aggregate metric cards** — Avg Waiting Time, Avg Turnaround Time, Avg Response Time, Throughput, CPU Utilization, Total Completion Time
- **Per-process detail table** — Shows all computed times for each process
- **Animated Gantt chart** — Visualizes the execution timeline with color-coded process blocks and idle periods

### Step 4 — Comparison (`/comparison`)

When 2 or more algorithms were selected, this page provides:

- **Best algorithm banner** — Determined by a scoring system across 5 metrics (lowest avg WT, TAT, RT; highest throughput and utilization)
- **Side-by-side comparison table** — All metrics for all algorithms, with best values highlighted in green
- **CPU utilization line chart** — Built with Recharts
- **Gantt chart comparison grid** — All Gantt charts displayed in a responsive grid
- **Export buttons** — Download results as JSON or generate a formatted PDF report

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                         │
│                 (React 18 + Vite)                    │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────┐ │
│  │ Process  │→ │Algorithm │→ │ Results │→ │Compare│ │
│  │  Input   │  │Selection │  │  Page   │  │ Page  │ │
│  └──────────┘  └──────────┘  └─────────┘  └──────┘ │
│        │              │                       │      │
│        ▼              ▼                       ▼      │
│  ┌─────────────────────────────────────────────────┐ │
│  │        SchedulerContext (useReducer)             │ │
│  │  processes | algorithms | results | loading     │ │
│  └─────────────────────────────────────────────────┘ │
│        │              │                              │
│        ▼              ▼                              │
│  ┌─────────────────────────────────────────────────┐ │
│  │           schedulerApi.js (fetch)               │ │
│  └────────────────────┬────────────────────────────┘ │
└───────────────────────┼──────────────────────────────┘
                        │  HTTP (proxied /api → :6000)
┌───────────────────────┼──────────────────────────────┐
│                       ▼        Backend               │
│               (Express.js + Node.js)                 │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │              Routes → Controllers              │  │
│  │   POST /api/processes  →  saveProcesses()      │  │
│  │   GET  /api/processes/:id → getProcesses()     │  │
│  │   POST /api/schedule   →  runSchedule()        │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │                              │
│          ┌────────────┼────────────┐                 │
│          ▼            ▼            ▼                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│  │  Mongoose │ │ Services  │ │           │          │
│  │  Models   │ │ fcfs.js   │ │           │          │
│  │           │ │ sjf.js    │ │           │          │
│  │ProcessSet │ │ ljf.js    │ │           │          │
│  │           │ │ roundRobin│ │           │          │
│  └─────┬─────┘ └───────────┘ └───────────┘          │
│        │                                             │
└────────┼─────────────────────────────────────────────┘
         │
         ▼
   ┌───────────┐
   │  MongoDB  │
   │  (Atlas)  │
   └───────────┘
```

### State Management

- **SchedulerContext** — Uses React's `useReducer` to manage global app state: processes, process set ID, selected algorithms, time quantum, results, loading state, and errors.
- **ThemeContext** — Uses `useState` + `localStorage` to manage and persist the dark/light theme preference. Applies the theme via a `data-theme` attribute on `<html>`.

### Styling

- Plain CSS with **CSS Custom Properties** (design tokens) for theming.
- Light and dark themes defined via `:root` and `[data-theme='dark']` selectors.
- Each component/page has its own scoped CSS file.
- Responsive breakpoints at 640px and 860px.
- Font: **Inter** via Google Fonts.

---

## License

This project was built as a college lab project for the Operating Systems course (Semester 4).
