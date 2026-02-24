# WebMonitor Frontend

The frontend for WebMonitor, built with React and Vite, provides a modern interface for managing and viewing monitored URLs.

## Features

- **Dashboard**: View all monitored links and their latest status.
- **History View**: detailed history of changes for specific URLs.
- **Real-time Status**: Visual indicators for backend and LLM health.
- **Clean UI**: Built with Framer Motion for smooth transitions.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Development**:
   ```bash
   npm run dev
   ```

3. **Build**:
   ```bash
   npm run build
   ```

## Configuration

The frontend expects the backend API to be available at `http://localhost:8000`. This is configured in `src/api.js`.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (modular design)
