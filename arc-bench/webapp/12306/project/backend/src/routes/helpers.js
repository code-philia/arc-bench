const { get } = require('../database/db_runtime');

function error(res, message, status = 400) {
  return res.status(status).json({ message });
}

async function currentUser(req) {
  const id = Number(req.headers['x-user-id']);
  return id ? get('SELECT * FROM users WHERE id=?', [id]) : null;
}

function emailIsValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
}

function mobileIsValid(value) {
  return /^\d{7,15}$/.test(String(value || ''));
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

module.exports = { error, currentUser, emailIsValid, mobileIsValid, publicUser };
