# Study Session Planner — Frontend

A React + TypeScript single-page application to track and manage study sessions. Features a dashboard with statistics, subject management, and session tracking with an intuitive UI.

## 🚀 Live Demo

- **App:** [https://study-session-project.netlify.app](https://study-session-project.netlify.app)
- **API:** [https://study-session-backend-vhhw.onrender.com](https://study-session-backend-vhhw.onrender.com)

## 📋 About

Study Session Planner helps users organize and monitor their study habits. Users can create subjects, log study sessions with quick-select durations, and visualize their progress through a dashboard with statistics.

### Features

- **Dashboard** — Overview with total hours studied, subject count, session count, subject cards, and recent sessions
- **Subject Management** — Create, edit, and delete subjects with custom colors
- **Session Tracking** — Log sessions with quick duration buttons (15m, 30m, 45m, 1h, 1.5h, 2h), date shortcuts (Today/Yesterday), and optional notes
- **Sessions Overview** — View all sessions grouped by day, filter by subject, and search by notes
- **Responsive Design** — Vibrant dark theme with gradients and smooth animations

## 🛠️ Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **HTTP Client:** Axios
- **Routing:** React Router DOM
- **Styling:** Custom CSS
- **Deployment:** Netlify

## 📁 Project Structure

```
study-session-frontend/
├── public/
│   ├── favicon.svg
│   └── _redirects            # Netlify SPA redirect
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ColorPicker.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── SubjectsPage.tsx
│   │   ├── SubjectDetailsPage.tsx
│   │   └── SessionsPage.tsx
│   ├── services/
│   │   └── api.ts            # Axios API calls
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── App.tsx               # Router setup
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── tsconfig.json
└── package.json
```

## 📸 Pages

### Home — Dashboard
- Total hours studied, subject count, session count
- Subject cards with individual study time
- Recent sessions list

### Subjects
- Create subjects with name, description, and custom color
- Edit and delete subjects
- Navigate to subject details

### Subject Details
- View subject info and total study time
- Add sessions with quick duration buttons and date shortcuts
- Edit and delete individual sessions

### Sessions
- All sessions grouped by day with daily totals
- Filter by subject
- Search sessions by notes
- Add new sessions directly

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- Backend API running ([see backend repo](https://github.com/ArthurSJz/study-session-backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/ArthurSJz/study-session-frontend.git
cd study-session-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start the development server
npm run dev
```

### Environment Variables

| Variable     | Description                              |
|--------------|------------------------------------------|
| VITE_API_URL | Backend API URL (default: http://localhost:3000/api) |

## 📜 Scripts

| Script           | Description                |
|------------------|----------------------------|
| `npm run dev`    | Start development server   |
| `npm run build`  | Build for production       |
| `npm run preview`| Preview production build   |

## 🔗 Related

- [Backend Repository](https://github.com/ArthurSJz/study-session-backend)
