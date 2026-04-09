# Whether.io Setup

A React Native Web / Expo prototype for an outdoor meetup organizer to compare weather for next week vs the week after.

## Prerequisites
- Node.js LTS (e.g. v22)
- PNPM (e.g. v10)
- EAS CLI (optional, if you plan to deploy to mobile app stores)

## Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in the values. (An example is pre-filled with the provided Visual Crossing key)
   ```bash
   cp .env.example .env
   ```

## Development Commands

- **Run Web:** `pnpm start --web` (Runs the web bundler at port 8081)
- **Run iOS (Sim):** `pnpm start --ios`
- **Run Android (Emu):** `pnpm start --android`
- **Run Tests:** `pnpm exec jest`
- **Run Typecheck:** `pnpm exec tsc --noEmit`
- **Run Linter (Biome):** `pnpm exec biome check .`

## Project Structure

- `app/`: Expo Router pages. Core view logic resides in `app/(tabs)/index.tsx`.
- `src/components/`: Dump UI components like TopBar, Comparison panels, and SVG D3 Charts.
- `src/features/`: Redux slices (e.g., event form configuration like location, day, time-slot selection).
- `src/lib/`: Custom pure functions containing Date offsets, and AI/Heuristic driven logic (like deterministic messages & recommendation calculations).
- `src/store/`: Redux Toolkit store + RTK Query endpoints connected to Visual Crossing.
- `src/test/`: Contains unit tests validating business domain capabilities.

## Deployment Readiness

### Web Deployment (EAS / Vercel / Netlify)
You can directly export the SPA for web hosting by running:
```bash
npx expo export --platform web
```
The resulting static files will be placed in the `dist` folder, which can be uploaded to Vercel or any static file host.

### Mobile App Deployment (EAS)
The repo is primed with `eas.json` for Expo Application Services (EAS). To trigger an iOS build:
```bash
eas build --platform ios --profile preview
```

## Known Limitations & Compromises
- Real-world UI requires physical screen bounding tests for edge-cases. The chart uses fixed height to guarantee rendering across engines.
- D3 currently generates smoothed Bezier lines across arbitrary 1-hour ticks. This creates an optical illusion of intermediate minute-weather measurements, which is meant strictly for aesthetics.
- We've mocked authentication with msw to demonstrate the UI without overengineering the prototype
