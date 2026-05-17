# 🌉 Bridgr

Connecting Deggendorf, Pfarrkirchen, and Cham — finally.

## One-click setup for graders

1. Click the **"Code"** button → **"Codespaces"** → **"Create codespace on main"**
2. Wait 2 minutes for the container to build
3. The app will automatically start and open in a preview tab
4. If not, click the **"Ports"** tab and click the globe icon next to port 3000

## Architecture

- **Frontend:** HTML/CSS/JS served by Nginx (Docker container)
- **Database:** PostgreSQL (via Supabase)
- **API:** Supabase REST API (auto-generated)
- **Containerization:** Docker + docker-compose
- **Deployment:** GitHub Codespaces (development) + Railway (production)

## Features

- Student profiles across three campuses
- Cross-campus project board
- Unified events feed
- Transportation coordination
- Direct messaging (coming soon)

## For grading

The app is fully containerized. Run `docker-compose up --build` to start it manually if needed.

Live deployment: [Bridgr on Railway](your-railway-url-here)
