# Whether.io

A universal React Native / Expo application for outdoor meetup organizers to symmetrically compare multivariant weather forecasts across selected dates.

## Application Stack
- **Framework**: React Native (0.81) / Expo (v54) / Expo Router
- **State & Data**: Redux Toolkit / RTK Query / MSW (Mocking Service Worker)
- **Styling & UI**: NativeWind (Tailwind CSS) / `@rn-primitives` / Reanimated
- **Visualizations**: D3.js (SVG)
- **Quality Assurance**: Jest (Unit/Integration) / Maestro (E2E) / Biome (Linting)

## Native-First Philosophy
Built on true native primitives using `@rn-primitives` and `react-native-reanimated` to guarantee 60fps gesture-driven interactions, prioritizing iOS/Android UI fidelity while gracefully degrading to web via `react-native-web`. E2E tested structurally on native simulator hardware via Maestro.

## Key Utilities
- **`src/lib/weatherAnalyzer.ts`**: AI/Heuristic-driven deterministic recommendation engine for weather favorability.
- **`src/lib/dateUtils.ts`**: Pure function library for temporal offset math.
- **`src/store/`**: RTK Query endpoints interfaced with the Visual Crossing API.
- **`.maestro/`**: YAML-defined, structural E2E test flows mimicking visceral user interactions.

## Deployment Process
- **Web (Vercel/Netlify)**: Executes `npx expo export --platform web` yielding a static SPA in `/dist`.
- **Mobile (iOS/Android)**: Regulated via Expo Application Services (EAS). Build execution: `eas build --platform ios --profile preview`.

## Development Commands
- **Run Web**: `pnpm start --web`
- **Run iOS**: `pnpm start --ios`
- **Run Android**: `pnpm start --android`
- **Unit/Integration Tests**: `pnpm exec jest`
- **E2E Tests**: `pnpm run test:e2e`
- **Typecheck**: `pnpm exec tsc --noEmit`
- **Lint**: `pnpm exec biome check .`

## Project Structure
- `app/`: Expo Router endpoints and root layouts.
- `src/components/`: Reusable, atomic UI components (e.g., Accordions, Charts).
- `src/features/`: Domain-specific Redux slices matching user workflows.
- `src/lib/`: Custom pure functions and domain-logic extractors.
- `src/store/`: Redux store configuration and RTK Query APIs.

## Known Limitations
- D3 generates smoothed Bezier splines over 1-hour ticks, manufacturing a non-existent minute-by-minute curve strictly for aesthetic fluidity.
- Authentication paths are temporarily mocked using `msw` to prioritize core UI/UX validation over immediate backend scaffolding.
