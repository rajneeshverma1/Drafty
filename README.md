# Drafty: Real-Time Collaborative Whiteboard

Drafty is a high-performance, real-time collaborative whiteboarding application built with a modern monorepo architecture. It enables multiple users to draw, chat, and collaborate on a shared canvas with minimal latency.

## 🚀 Features

- **Real-Time Collaboration**: Instant synchronization of drawings and cursors across all connected clients.
- **High Performance**: Optimized canvas rendering for smooth 60FPS interaction.
- **Infinite Canvas**: Support for panning and zooming across an expansive workspace.
- **Integrated Chat**: Collaborative communication within the drawing environment.
- **Advanced Tools**: Vectors, hit-detection, and deterministic undo/redo.

## 🏗️ Tech Stack

- **Monorepo**: Turbo + pnpm
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion, Redux
- **Backend**: Node.js, Express.js (HTTP), ws (WebSockets)
- **Database**: PostgreSQL with Drizzle ORM
- **Language**: TypeScript

## 🛠️ Getting Started

### Prerequisites
- Node.js (>=20)
- pnpm (10.4.1+)
- PostgreSQL (14+)

### Installation
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up PostgreSQL database:
   ```bash
   createdb excalidraw
   ```

3. Set up environment variables:
   Create `.env` files based on the `env.example` templates:
   
   **`apps/http-server/.env`:**
   ```env
   SALTROUNDS="10"
   JWT_SECRET="your_secure_secret_key"
   PORT="3001"
   FRONTEND_ORIGIN="http://localhost:3000"
   DATABASE_URL="postgresql://username@localhost:5432/excalidraw"
   ```
   
   **`apps/ws-server/.env`:**
   ```env
   JWT_SECRET="your_secure_secret_key"
   PORT="8080"
   DATABASE_URL="postgresql://username@localhost:5432/excalidraw"
   ```
   
   **`apps/web/.env.local`:**
   ```env
   NEXT_PUBLIC_WS_URL="ws://localhost:8080/"
   NEXT_PUBLIC_HTTP_URL="http://localhost:3001/api/v1"
   ```
   
   **`packages/db/.env`:**
   ```env
   DATABASE_URL="postgresql://username@localhost:5432/excalidraw"
   ```

4. Run database migrations:
   ```bash
   pnpm db:migrate
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```
   
   This starts:
   - Next.js web app on `http://localhost:3000`
   - HTTP API server on `http://localhost:3001`
   - WebSocket server on `ws://localhost:8080`

6. Build for production:
   ```bash
   pnpm build
   ```
