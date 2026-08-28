const express = require('express');
const router = express.Router();
const { run, get } = require('../database/db_runtime');
const { error, emailIsValid, publicUser } = require('./helpers');

router.post('/register', async (req, res) => {
  const body = req.body || {};
  const required = ['nationality', 'name', 'passportNumber', 'username', 'email', 'passportExpirationDate', 'birthDate', 'gender', 'password', 'confirmPassword'];
  if (required.some((key) => !String(body[key] || '').trim())) return error(res, 'Please fill in all required fields.');
  if (body.password !== body.confirmPassword) return error(res, 'Passwords do not match.');
  if (!emailIsValid(body.email)) return error(res, 'Invalid email address format.');
  if (!body.agreement) return error(res, 'Please agree to the Terms of Service and Privacy Policy.');
  const duplicatePassport = await get('SELECT id FROM users WHERE passport_number=?', [body.passportNumber]);
  if (duplicatePassport) return error(res, 'Passport number already exists.');
  const duplicateUsername = await get('SELECT id FROM users WHERE username=?', [body.username]);
  if (duplicateUsername) return error(res, 'Username already exists.');
  try {
    const result = await run(`INSERT INTO users
      (username,email,mobile,password,name,passport_number,nationality,passport_expiration_date,birth_date,gender)
      VALUES (?,?,?,?,?,?,?,?,?,?)`, [body.username, body.email, body.mobile || null, body.password, body.name, body.passportNumber, body.nationality, body.passportExpirationDate, body.birthDate, body.gender]);
    await run(`INSERT INTO passengers (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,is_owner)
      VALUES (?,?,?,?,?,?,?,?,?,1)`, [result.lastID, body.name, body.passportNumber, body.nationality, body.passportExpirationDate, body.birthDate, body.gender, body.email, body.mobile || null]);
    res.json({ message: 'Registration successful.', userId: result.lastID });
  } catch (err) {
    error(res, err.message.includes('email') ? 'Email address already exists.' : 'Unable to register account.', 409);
  }
});

router.post('/login', async (req, res) => {
  const { account, password } = req.body || {};
  if (!account || !password) return error(res, 'Please enter your username/email/phone number and password.');
  const user = await get('SELECT * FROM users WHERE username=? OR email=? OR mobile=?', [account, account, account]);
  if (!user) return error(res, 'User not found.', 404);
  if (user.password !== password) return error(res, 'Incorrect password.', 401);
  res.json({ message: 'Login successful.', user: publicUser(user) });
});

router.post('/forgot/verify', async (req, res) => {
  const { email, idNumber } = req.body || {};
  if (!email || !idNumber) return error(res, 'Please enter your email and ID number.');
  const user = await get('SELECT id FROM users WHERE email=? AND passport_number=?', [email, idNumber]);
  if (!user) return error(res, 'Email address and ID number do not match.');
  res.json({ userId: user.id });
});

router.post('/forgot/reset', async (req, res) => {
  const { userId, password, confirmPassword } = req.body || {};
  if (!password || !confirmPassword) return error(res, 'Please fill in all required fields.');
  if (password !== confirmPassword) return error(res, 'Passwords do not match.');
  await run('UPDATE users SET password=? WHERE id=?', [password, userId]);
  res.json({ message: 'Password reset successful.' });
});

module.exports = router;
