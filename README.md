# Node.js Todo App

A simple Todo web app built with **pure Node.js** — no frameworks or external dependencies required!

## Features
- ✅ Add new tasks
- ✓ Mark tasks as done / undo
- ✕ Delete tasks
- 📊 Completion counter
- 🎨 Clean, responsive UI

## Getting Started

### Run the server
```bash
node server.js
```

Then open your browser at: **http://localhost:3000**

## How It Works

The app uses only Node.js built-in modules:
- **`http`** — creates the web server
- **`url`** — parses incoming request URLs

All data is stored in memory (resets when the server restarts).

## Project Structure
```
webapp/
├── server.js     # Main server — routing, HTML rendering, request handling
└── README.md     # This file
```

## Extending the App
- Add a database (e.g. SQLite) for persistent storage
- Add Express.js for easier routing
- Separate HTML into template files
- Add user authentication
