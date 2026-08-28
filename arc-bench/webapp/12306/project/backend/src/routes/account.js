const express = require('express');
const router = express.Router();
const { run, get, all, withTransaction } = require('../database/db_runtime');
const { error, currentUser, emailIsValid, mobileIsValid, publicUser } = require('./helpers');

router.get('/me', async (req, res) => {
  const user = await currentUser(req);
  if (!user) return error(res, 'Please log in first.', 401);
  res.json({ user: publicUser(user) });
});

router.get('/passengers', async (req, res) => {
  const user = await currentUser(req);
  if (!user) return error(res, 'Please log in first.', 401);
  res.json({ passengers: await all('SELECT * FROM passengers WHERE user_id=? ORDER BY is_owner DESC,id', [user.id]) });
});

router.post('/passengers', async (req, res) => {
  const user = await currentUser(req);
  if (!user) return error(res, 'Please log in first.', 401);
  const b = req.body || {};
  const required = ['nationality', 'name', 'passportNumber', 'passportExpirationDate', 'birthDate', 'gender', 'email', 'mobile', 'passengerType'];
  if (required.some((key) => !String(b[key] || '').trim())) return error(res, 'Please fill in all required fields.');
  if (!emailIsValid(b.email)) return error(res, 'Invalid email address format.');
  if (!mobileIsValid(b.mobile)) return error(res, 'Invalid mobile number format.');
  if (await get('SELECT id FROM passengers WHERE passport_number=?', [b.passportNumber])) return error(res, 'Passport number already exists.');
  await run(`INSERT INTO passengers (user_id,name,passport_number,nationality,passport_expiration_date,birth_date,gender,email,mobile,passenger_type)
    VALUES (?,?,?,?,?,?,?,?,?,?)`, [user.id, b.name, b.passportNumber, b.nationality, b.passportExpirationDate, b.birthDate, b.gender, b.email, b.mobile, b.passengerType]);
  res.json({ message: 'Passenger added successfully.' });
});

router.delete('/passengers', async (req, res) => {
  const user = await currentUser(req);
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [req.body?.id];
  if (!user) return error(res, 'Please log in first.', 401);
  await withTransaction(async ({ run: txRun }) => {
    for (const id of ids.filter(Boolean)) await txRun('DELETE FROM passengers WHERE id=? AND user_id=? AND is_owner=0', [id, user.id]);
  });
  res.json({ message: 'Passenger deleted successfully.' });
});

router.patch('/profile', async (req, res) => {
  const user = await currentUser(req);
  if (!user) return error(res, 'Please log in first.', 401);
  const b = req.body || {};
  if (b.password && b.password.length < 8) return error(res, 'Please enter a valid password.');
  if (b.email && !emailIsValid(b.email)) return error(res, 'Invalid email address format.');
  if (b.mobile && !mobileIsValid(b.mobile)) return error(res, 'Invalid mobile number format.');
  const fields = []; const params = [];
  for (const key of ['gender', 'passengerType', 'email', 'mobile', 'password']) {
    if (b[key] !== undefined && !(key === 'password' && !String(b[key]).trim())) { fields.push(`${key === 'passengerType' ? 'passenger_type' : key}=?`); params.push(b[key]); }
  }
  if (fields.length) await run(`UPDATE users SET ${fields.join(',')} WHERE id=?`, [...params, user.id]);
  res.json({ message: 'Profile updated successfully.', user: publicUser(await get('SELECT * FROM users WHERE id=?', [user.id])) });
});

router.post('/password', async (req, res) => {
  const user = await currentUser(req); const b = req.body || {};
  if (!user) return error(res, 'Please log in first.', 401);
  if (!b.currentPassword || !b.newPassword || !b.confirmPassword) return error(res, 'Please fill in all password fields.');
  if (user.password !== b.currentPassword) return error(res, 'Incorrect current password.');
  if (b.newPassword !== b.confirmPassword) return error(res, 'New passwords do not match.');
  await run('UPDATE users SET password=? WHERE id=?', [b.newPassword, user.id]);
  res.json({ message: 'Password changed successfully.' });
});

router.post('/email', async (req, res) => {
  const user = await currentUser(req); const b = req.body || {};
  if (!user) return error(res, 'Please log in first.', 401);
  if (!b.email || !b.password) return error(res, 'Please fill in the new email and password.');
  if (user.password !== b.password) return error(res, 'Incorrect password.');
  if (!emailIsValid(b.email)) return error(res, 'Invalid email address format.');
  await run('UPDATE users SET email=? WHERE id=?', [b.email, user.id]);
  res.json({ message: 'Security mailbox updated successfully.', user: publicUser(await get('SELECT * FROM users WHERE id=?', [user.id])) });
});

router.post('/mobile', async (req, res) => {
  const user = await currentUser(req); const b = req.body || {};
  if (!user) return error(res, 'Please log in first.', 401);
  if (!b.mobile || !b.password) return error(res, 'Please fill in the new mobile number and password.');
  if (user.password !== b.password) return error(res, 'Incorrect password.');
  if (!mobileIsValid(b.mobile)) return error(res, 'Invalid mobile number format.');
  await run('UPDATE users SET mobile=? WHERE id=?', [b.mobile, user.id]);
  res.json({ message: 'Mobile number updated successfully.', user: publicUser(await get('SELECT * FROM users WHERE id=?', [user.id])) });
});

module.exports = router;
