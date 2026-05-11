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
- pnpm

### Installation
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   Check `env.example` files in each app/package and create corresponding `.env` files.

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```
