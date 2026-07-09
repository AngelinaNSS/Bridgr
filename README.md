# Bridgr

Internal Talent Marketplace for German SMEs

## One-click setup for graders

1. Click the **"Code"** button → **"Codespaces"** → **"Create codespace on main"**
2. Wait 2 minutes for the container to build
3. In the terminal, run: `docker-compose up --build`
4. Click the **"Ports"** tab and click the globe icon next to port 3000
5. Create an account and start using Bridgr

## Architecture

- **Frontend:** HTML/CSS/JS served by Nginx (Docker container)
- **Backend:** Node.js with Express REST API
- **Database:** PostgreSQL
- **Containerization:** Docker + docker-compose
- **Deployment:** GitHub Codespaces (development)
- **CI/CD:** GitHub Actions

## Features

- **Employee Profiles** — Skills, department, office location, CV upload
- **Internal Requests** — Post "I need help" with priority levels (Normal, High, Urgent)
- **Cross-Office Filtering** — Find talent across Munich, Hamburg, Berlin, Cologne, Frankfurt
- **Hiring Freeze Mode** — Enforce hiring policies, disable external hiring, track savings
- **Admin Dashboard** — Track completion rates, top helpers, and collaboration analytics
- **Language Toggle** — Switch between German and English
- **Direct Messaging** — Connect with colleagues across offices

## For grading

The app is fully containerized. Run `docker-compose up --build` to start it manually if needed.

## Links

- **GitHub Repository:** https://github.com/AngelinaNSS/Bridgr
- **Live Deployment:** Coming soon (Railway)
