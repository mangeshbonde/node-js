const http = require('http');
const url = require('url');

const PORT = 3000;

// Simple in-memory data store
const todos = [
  { id: 1, text: 'Learn Node.js', done: false },
  { id: 2, text: 'Build a web app', done: false },
];
let nextId = 3;

// HTML template
function renderPage(todos) {
  const todoItems = todos
    .map(
      (t) => `
    <li class="${t.done ? 'done' : ''}">
      <span>${t.text}</span>
      <div class="actions">
        <form method="POST" action="/toggle/${t.id}" style="display:inline">
          <button type="submit">${t.done ? '↩ Undo' : '✓ Done'}</button>
        </form>
        <form method="POST" action="/delete/${t.id}" style="display:inline">
          <button type="submit" class="del">✕</button>
        </form>
      </div>
    </li>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node.js Todo App</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #f0f4f8;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 40px 16px;
    }
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.1);
      padding: 32px;
      width: 100%;
      max-width: 480px;
      height: fit-content;
    }
    h1 {
      font-size: 1.8rem;
      color: #1a202c;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #718096;
      font-size: 0.9rem;
      margin-bottom: 24px;
    }
    form.add-form {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
    input[type="text"] {
      flex: 1;
      padding: 10px 14px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="text"]:focus { border-color: #667eea; }
    button {
      padding: 10px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
      transition: background 0.2s;
    }
    button:hover { background: #5a67d8; }
    button.del { background: #fc8181; }
    button.del:hover { background: #f56565; }
    ul { list-style: none; }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      border-radius: 8px;
      margin-bottom: 8px;
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      transition: opacity 0.2s;
    }
    li.done { opacity: 0.5; }
    li.done span { text-decoration: line-through; color: #a0aec0; }
    .actions { display: flex; gap: 6px; }
    .empty {
      text-align: center;
      color: #a0aec0;
      padding: 32px 0;
      font-size: 0.95rem;
    }
    .stats {
      margin-top: 16px;
      color: #718096;
      font-size: 0.85rem;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 Todo App</h1>
    <p class="subtitle">Built with Node.js — no frameworks!</p>

    <form class="add-form" method="POST" action="/add">
      <input type="text" name="text" placeholder="Add a new task..." required autofocus />
      <button type="submit">Add</button>
    </form>

    <ul>
      ${todoItems || `<div class="empty">No tasks yet. Add one above!</div>`}
    </ul>

    <p class="stats">
      ${todos.filter((t) => t.done).length} of ${todos.length} tasks completed
    </p>
  </div>
</body>
</html>`;
}

// Parse POST body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const params = new URLSearchParams(body);
      const obj = {};
      for (const [k, v] of params) obj[k] = v;
      resolve(obj);
    });
  });
}

// Create server
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url);
  const pathname = parsed.pathname;
  const method = req.method;

  // GET /
  if (method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(renderPage(todos));
  }

  // POST /add
  if (method === 'POST' && pathname === '/add') {
    const body = await parseBody(req);
    if (body.text && body.text.trim()) {
      todos.push({ id: nextId++, text: body.text.trim(), done: false });
    }
    res.writeHead(302, { Location: '/' });
    return res.end();
  }

  // POST /toggle/:id
  const toggleMatch = pathname.match(/^\/toggle\/(\d+)$/);
  if (method === 'POST' && toggleMatch) {
    const id = parseInt(toggleMatch[1]);
    const todo = todos.find((t) => t.id === id);
    if (todo) todo.done = !todo.done;
    res.writeHead(302, { Location: '/' });
    return res.end();
  }

  // POST /delete/:id
  const deleteMatch = pathname.match(/^\/delete\/(\d+)$/);
  if (method === 'POST' && deleteMatch) {
    const id = parseInt(deleteMatch[1]);
    const idx = todos.findIndex((t) => t.id === id);
    if (idx !== -1) todos.splice(idx, 1);
    res.writeHead(302, { Location: '/' });
    return res.end();
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
