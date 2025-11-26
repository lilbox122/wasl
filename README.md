# Wasl — Crisis-Response Platform (Demo)

Wasl is a crisis-response platform designed to help people in war and emergency zones stay safe and informed. This repository contains a UI-only demo that illustrates the core ideas and workflows.

## Idea
- Collect on-the-ground reports to send instant alerts about danger zones, bombing areas, and available humanitarian aid.
- Analyze reports with AI to verify information, predict high-risk areas, and optimize rescue routes.
- Provide every user with an offline digital ID containing medical information and family contacts, usable by rescuers without internet.
- Offer offline humanitarian maps and secure blockchain-style transfer queues for emergency funds.
- Integrate electromechanical solutions (low-power sensors, portable devices, automated field hardware) to detect threats and maintain communication using independent energy sources.

Together, AI, field hardware, and the digital platform form a resilient safety network for civilians and responders.

## What This Demo Shows
- Live alerts list (verified/pending) and incident reporting form.
- Interactive map with danger and aid markers, route overlay, and a simulated risk heatmap.
- Offline digital ID card with local storage and downloadable JSON (with QR fallback).
- Secure transfer UI with an offline queue that auto-sends when connectivity returns.
- Installable PWA with service worker caching and offline support.

## Important Notes
- This is a demo: there is no backend, real data feed, cryptographic verification, or blockchain integration.
- The “AI” elements are simulated; verification and risk forecasting are mock computations.
- Do not use for real operations. It is for concept exploration only.

## Run Locally
1. Ensure you have Python 3 installed.
2. From the project directory, run:
   - `python -m http.server 8080`
3. Open `http://localhost:8080/` in your browser.

## Offline Behavior
- A service worker caches core files for offline use when served on `localhost` or HTTPS.
- If assets look outdated, hard-refresh the page or unregister the service worker in DevTools.

## Data & Privacy
- Data is stored locally in your browser (`localStorage`).
- The offline ID is saved only on your device when you choose “Save Local” or download.

## Architecture (Demo)
- Plain HTML/CSS/JS with Leaflet for maps, heatmap plugin, and QR (with canvas fallback).
- No external APIs; all data is generated or stored locally.

## Known Limitations
- External CDNs may be blocked on some networks; the app includes fallbacks and graceful degradation.
- Geolocation permissions may affect centering the map.

## Next Steps (Concept)
- Real-time ingestion and trust scoring pipeline.
- Offline-first routing and hazard overlays.
- Sensor telemetry integration and health monitoring.
- Secure identities and transfers with cryptographic primitives.

---
This demo is provided for showcasing the concept and design direction of Wasl.
