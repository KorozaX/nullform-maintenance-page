# NULLFORM

This is a test project exploring a minimalist, Nothing-esque style maintenance page. Feel free to modify, fork, or build upon it.

A fictional system maintenance portal with live-feeling telemetry, an animated recovery dial, expandable infrastructure statuses, and a simulated restoration-email flow.

> All system metrics, maintenance progress, and infrastructure statuses are demonstration data. The email subscription is simulated and does not send actual emails.

## Live Demo

[The Vercel deployment URL will be added here once the project is published.](https://nullform-maintenance-page.vercel.app/) 

## Features

- Oversized monochrome hero with a live maintenance clock, progress and estimated completion
- Animated recovery dial with a system diagnostic interaction
- Six expandable infrastructure components with status telemetry
- Keyboard-accessible four-stage maintenance timeline
- Full-screen system menu with focus management
- Simulated email subscription with validation and confirmation states
- Dot-matrix canvas background, subtle reveals and reduced-motion support
- Responsive layout from small mobile screens through wide desktop

## Tech Stack

- React 19
- TypeScript
- Vite
- Plain CSS
- Space Grotesk and IBM Plex Mono via Fontsource
- Playwright and axe-core for local interface and accessibility checks

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

Create a production build with:

```bash
npm run build
npm run preview
```

## License

No license is included in this repository.
