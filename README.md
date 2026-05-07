# UniModernize

An AI-powered platform that crawls legacy university websites, analyzes their content and accessibility, and generates modern, responsive redesigns — preserving all content while transforming the experience.

## What it does

- Recursively crawls university websites using Puppeteer
- Parses raw HTML into structured content (navigation, headings, metadata, assets)
- Runs automated WCAG accessibility audits via axe-core
- Extracts brand identity (colors, fonts, logo) directly from crawled CSS
- Classifies pages using an LLM pipeline (homepage, faculty directory, course listing, etc.)
- Generates accessible, responsive HTML/CSS redesigns using AI
- Exports output as static HTML, Next.js projects, or WordPress themes

## Tech Stack

- **Backend:** NestJS, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Queue:** BullMQ, Redis
- **Crawler:** Puppeteer, Cheerio
- **AI:** LangChain.js, OpenRouter API (swappable provider)
- **Infrastructure:** Docker, Docker Compose

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop

### Setup

```bash
# Clone the repo
git clone https://github.com/prashawntK/unimodernized.git
cd unimodernized

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env

# Start PostgreSQL and Redis
docker compose up -d

# Run database migrations
npx prisma migrate dev

# Start the app
npm run start:dev
