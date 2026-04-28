# ChargEV — Mobile App

A production-ready **React Native Expo** mobile application for EV charging station discovery, booking, and management. Connects to the existing Django backend API.

## ⚡ Features

- **Authentication** — Login, Register, persistent JWT token, protected routes
- **Dashboard** — Live stats, recommended stations, recent activity
- **Station Discovery** — Browse, search, and filter charging stations
- **Map View** — Interactive dark-themed map with station markers
- **Station Details** — Full station info, charger types, amenities, pricing
- **Booking Flow** — Select slot, charger type, energy needed, get cost estimate
- **My Bookings** — View, filter, and cancel bookings
- **Favorites** — Save stations for quick access (persisted offline)
- **Search** — Full-text search with recent search history
- **Profile** — Edit user details, vehicle info, and manage account
- **Settings** — App preferences and info

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo (SDK 54) |
| Routing | Expo Router (file-based) |
| State | Zustand |
| HTTP | Axios |
| Storage | AsyncStorage |
| Maps | react-native-maps |
| Icons | @expo/vector-icons (Ionicons) |
| Language | TypeScript |

## 📁 Project Structure

```
mobile/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (auth)/             # Auth screens (login, register)
│   ├── (tabs)/             # Tab screens (home, stations, map, bookings, profile)
│   ├── station/[id].tsx    # Station details
│   ├── booking/[stationId].tsx  # Booking flow
│   ├── search.tsx          # Search screen
│   ├── favorites.tsx       # Favorites screen
│   ├── settings.tsx        # Settings screen
│   └── _layout.tsx         # Root layout with auth guard
├── src/
│   ├── api/                # Axios API client + modules (auth, stations, bookings, dashboard)
│   ├── components/         # Reusable UI (Button, Input, Card, StationCard, etc.)
│   ├── constants/          # API endpoints, charger types, storage keys
│   ├── store/              # Zustand stores (auth, stations, bookings, favorites)
│   ├── theme/              # Design tokens (colors, typography, spacing, shadows)
│   └── utils/              # Formatters, geo helpers, utilities
└── assets/                 # App icons and images
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone (for testing)
- The Django backend running on port 8000

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Start the Backend

```bash
cd ../backend
python manage.py runserver
```

> **Note:** The backend must have `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py` during development, or add your device's IP to `CORS_ALLOWED_ORIGINS`.

### 3. Configure API URL

The app auto-detects the correct backend URL:
- **Android Emulator**: `http://10.0.2.2:8000/api`
- **iOS Simulator**: `http://localhost:8000/api`

For physical devices, update `src/constants/index.ts` with your machine's local IP:
```ts
return 'http://YOUR_IP:8000/api';
```

### 4. Run the App

```bash
# Start Expo dev server
npx expo start

# Or run directly on platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

### 5. Google Maps (Android)

For Android map support, add your Google Maps API key in `app.json`:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

## 🔌 Backend API Endpoints Used

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/login/` | POST | ❌ | Login with email/password |
| `/api/auth/signup/` | POST | ❌ | Register new user |
| `/api/auth/me/` | GET/PATCH | ✅ | Get/update profile |
| `/api/stations/` | GET | ❌ | List stations with filters |
| `/api/stations/:id/` | GET | ❌ | Station details |
| `/api/stations/:id/available-slots/` | GET | ❌ | Available time slots |
| `/api/stations/import/` | POST | ❌ | Import external station |
| `/api/bookings/` | GET/POST | ✅ | List/create bookings |
| `/api/bookings/:id/cancel/` | PATCH | ✅ | Cancel a booking |
| `/api/dashboard/` | GET | ❌ | Dashboard stats |

## 🎨 Design System

The app uses a custom dark EV theme:

- **Background**: `#0F1419` (deep dark)
- **Cards**: `#242A33` with subtle borders
- **Primary**: `#467EE5` (blue)
- **Accent**: `#22C55E` (green energy)
- **Text**: `#F5F5F5` / `#94A3B8` / `#64748B` hierarchy

## 📱 Build for Production

```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Or use EAS Build
npx eas build --platform android
npx eas build --platform ios
```

## 📄 License

Part of the ChargEV project. All rights reserved.
