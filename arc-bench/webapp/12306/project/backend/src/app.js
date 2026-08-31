const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const accountRoutes = require('./routes/account');
const orderRoutes = require('./routes/orders');

// middleware imports
app.use(cors());
app.use(bodyParser.json());

// Initialize the database before reporting the service as ready.
const { initializeDatabase } = require('./database/init_db');
const seedDatabase = require('./database/seed_db');
const startupReady = initializeDatabase().then(() => seedDatabase()).catch((error) => {
  console.error('Database seed failed:', error);
  throw error;
});

// register routes
app.get('/api/health', async (req, res) => {
  try {
    await startupReady;
  } catch {
    return res.status(503).json({ code: 503, message: 'Backend initialization failed' });
  }
  res.json({ code: 200, message: 'Backend Ready' });
});
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/orders', orderRoutes);

const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Keep API routes on the backend and serve the SPA for all other GET requests.
  app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res
      .status(503)
      .type('html')
      .send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Frontend Build Missing</title>
    <style>
      body {
        margin: 0;
        font-family: ui-sans-serif, system-ui, sans-serif;
        background: #f6f7f9;
        color: #1f2937;
      }
      main {
        max-width: 720px;
        margin: 12vh auto 0;
        padding: 24px;
      }
      section {
        background: #fff;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      }
      h1 {
        margin-top: 0;
      }
      code {
        background: #f3f4f6;
        padding: 2px 6px;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>Frontend build missing</h1>
        <p>The backend is running, but <code>frontend/dist</code> is not available yet.</p>
        <p>Build the frontend first, then start the backend so it can host the compiled site on the same port.</p>
      </section>
    </main>
  </body>
</html>`);
  });
}

module.exports = app;
