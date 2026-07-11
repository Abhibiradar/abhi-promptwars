# MonsoonShield AI 🌧️

A real-time, context-aware disaster preparedness assistant powered by **Gemini GenAI** and **OpenWeatherMap**.

## Chosen Vertical
**Disaster Preparedness & Climate Change (Monsoon Season Persona)**
MonsoonShield AI is explicitly designed for the Monsoon season. It acts as an intelligent emergency management assistant, providing highly contextual safety protocols, travel advisories, and emergency checklists based on live, local weather metrics.

## Approach and Logic
Instead of relying on hardcoded prompts or static mock data, MonsoonShield takes a dynamic, multi-modal pipeline approach:
1. **Real-Time Data Ingestion:** Uses the browser's Geolocation API to auto-detect user coordinates.
2. **Context Assembly:** Fetches live, hyper-local weather data (temperature, exact wind speed, storm severity) from OpenWeatherMap.
3. **Generative Processing:** Pipes the exact real-time weather metrics and the user's name directly into the Gemini `gemini-flash-latest` model.
4. **Dynamic Output:** AI produces a zero-shot, tailored emergency plan (e.g. "Since winds are currently 12m/s in Pune, secure your outdoor furniture").

## How the Solution Works
1. **Onboarding:** The user securely inputs their name, which is persisted to `localStorage` for a seamless "real-world" experience without fake logins.
2. **Auto-Location:** The dashboard provides a one-click Auto-Detect button utilizing the HTML5 Geolocation API to instantly find the user's city and fetch real-world storm data.
3. **Interactive AI Chat:** Users converse with the Gemini Assistant in multiple languages (English, Hindi, Bengali, Spanish). The chat UI supports strict DOMPurify sanitization to block XSS payloads and renders rich Markdown.
4. **Quick Actions:** Pre-configured buttons ("Flood Safety", "Shelters") allow rapid extraction of critical survival data.

## Any Assumptions Made
- **Geolocation Permission:** Assumes the user allows browser location access for the auto-detect feature. (If denied, manual search serves as a fallback).
- **Environment Variables:** Assumes the deployer has provided valid `VITE_GEMINI_API_KEY` and `VITE_WEATHER_API_KEY` in their Vercel/Node environment.
- **API Availability:** Assumes the Google Generative AI and OpenWeatherMap APIs are reachable and the host network isn't blocking outbound API requests (mitigated with a strict CSP).
