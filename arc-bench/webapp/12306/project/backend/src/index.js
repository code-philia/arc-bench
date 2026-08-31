const app = require('./app');
const { closeDb } = require('./database/init_db');
const defaultPort = 3000;
const port = Number(process.env.PORT || defaultPort);

const server = app.listen(port, () => {
  console.log(`Backend listening at http://127.0.0.1:${port}`);
});

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  server.close(async () => {
    try {
      await closeDb();
      process.exit(0);
    } catch (error) {
      console.error('Backend shutdown failed:', error);
      process.exit(1);
    }
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
