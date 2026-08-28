const express = require('express');
const router = express.Router();
const { run, get, all } = require('../database/db_runtime');
const { error, currentUser } = require('./helpers');

async function orderDetail(id) {
  return get(`SELECT o.*, t.train_no,t.from_city,t.to_city,t.from_station,t.to_station,t.travel_date,t.departure_time,t.arrival_time,t.duration_minutes
    FROM orders o JOIN trains t ON t.id=o.train_id WHERE o.id=?`, [id]);
}

router.get('/', async (req, res) => {
  const user = await currentUser(req);
  if (!user) return error(res, 'Please log in first.', 401);
  const orders = await all(`SELECT o.*,t.train_no,t.from_city,t.to_city,t.from_station,t.to_station,t.travel_date,t.departure_time,t.arrival_time
    FROM orders o JOIN trains t ON t.id=o.train_id WHERE o.user_id=? ORDER BY o.id DESC`, [user.id]);
  res.json({ orders });
});

router.post('/', async (req, res) => {
  const user = await currentUser(req); const { trainId, passengers } = req.body || {};
  if (!user) return error(res, 'Please log in first.', 401);
  if (!passengers?.length) return error(res, 'Please select at least one passenger.');
  try {
    const result = await require('../database/db_runtime').withTransaction(async ({ get: txGet, run: txRun }) => {
      const train = await txGet('SELECT * FROM trains WHERE id=?', [trainId]);
      if (!train) throw new Error('TRAIN_NOT_FOUND');
      const passengerIds = passengers.map((item) => Number(item.id));
      if (passengerIds.some((id) => !Number.isInteger(id)) || new Set(passengerIds).size !== passengerIds.length) throw new Error('INVALID_PASSENGERS');
      const ownedPassengers = await txGet(`SELECT COUNT(*) AS count FROM passengers WHERE user_id=? AND id IN (${passengerIds.map(() => '?').join(',')})`, [user.id, ...passengerIds]);
      if (ownedPassengers.count !== passengerIds.length) throw new Error('INVALID_PASSENGERS');
      const columns = { 'Business-class seat': ['business_seats', 'business_price'], 'First-class seat': ['first_seats', 'first_price'], 'Second-class seat': ['second_seats', 'second_price'], 'Standing ticket': ['standing_seats', 'standing_price'] };
      const counts = {};
      for (const item of passengers) {
        if (!columns[item.seatType]) throw new Error('NO_TICKETS');
        counts[item.seatType] = (counts[item.seatType] || 0) + 1;
      }
      for (const [seatType, count] of Object.entries(counts)) {
        const column = columns[seatType][0];
        if (Number(train[column] || 0) < count) throw new Error('NO_TICKETS');
        await txRun(`UPDATE trains SET ${column}=${column}-? WHERE id=?`, [count, trainId]);
      }
      const pricedPassengers = passengers.map((item) => ({ ...item, price: Number(train[columns[item.seatType][1]] || 0) }));
      const totalPrice = pricedPassengers.reduce((sum, item) => sum + item.price, 0);
      const orderNumber = `E${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const inserted = await txRun('INSERT INTO orders (order_number,user_id,train_id,status,total_price,passenger_json) VALUES (?,?,?,?,?,?)', [orderNumber, user.id, trainId, 'unpaid', totalPrice, JSON.stringify(pricedPassengers)]);
      return inserted.lastID;
    });
    res.json({ message: 'Order submitted successfully.', order: await orderDetail(result) });
  } catch (err) {
    if (err.message === 'NO_TICKETS') return error(res, 'Sorry, there are no tickets available for the selected ticket class.');
    if (err.message === 'INVALID_PASSENGERS') return error(res, 'Invalid passenger selection.');
    return error(res, 'Unable to submit order.', 500);
  }
});

router.get('/:id', async (req, res) => {
  const user = await currentUser(req); if (!user) return error(res, 'Please log in first.', 401);
  const order = await get('SELECT * FROM orders WHERE id=? AND user_id=?', [req.params.id, user.id]);
  if (!order) return error(res, 'Order not found.', 404);
  res.json({ order: await orderDetail(order.id) });
});

router.patch('/:id/status', async (req, res) => {
  const user = await currentUser(req); const { status } = req.body || {};
  if (!user) return error(res, 'Please log in first.', 401);
  const allowed = ['paid', 'cancelled', 'refunded'];
  if (!allowed.includes(status)) return error(res, 'Invalid order status.');
  const order = await orderDetail(req.params.id);
  if (!order || order.user_id !== user.id) return error(res, 'Order not found.', 404);
  const validTransition = (order.status === 'unpaid' && ['paid', 'cancelled'].includes(status)) || (order.status === 'paid' && status === 'refunded');
  if (!validTransition) return error(res, 'Invalid order status transition.');
  if (status === 'refunded' && order.status !== 'paid') return error(res, 'Only paid upcoming orders can be refunded.');
  if (status === 'refunded' && (!order.refund_deadline || new Date(order.refund_deadline).getTime() <= Date.now())) {
    return error(res, 'The refund deadline has passed.');
  }
  if (!['cancelled', 'refunded'].includes(order.status) && ['cancelled', 'refunded'].includes(status)) {
    const seats = {};
    for (const passenger of JSON.parse(order.passenger_json)) seats[passenger.seatType] = (seats[passenger.seatType] || 0) + 1;
    const columns = { 'Business-class seat': 'business_seats', 'First-class seat': 'first_seats', 'Second-class seat': 'second_seats', 'Standing ticket': 'standing_seats' };
    for (const [seatType, count] of Object.entries(seats)) if (columns[seatType]) await run(`UPDATE trains SET ${columns[seatType]}=${columns[seatType]}+? WHERE id=?`, [count, order.train_id]);
  }
  const refundDeadline = status === 'paid' ? `${order.travel_date}T${order.departure_time}:00` : order.refund_deadline;
  await run('UPDATE orders SET status=?,refund_deadline=?,cancelled_at=CASE WHEN ? IN (\'cancelled\',\'refunded\') THEN CURRENT_TIMESTAMP ELSE cancelled_at END WHERE id=? AND user_id=?', [status, refundDeadline, status, req.params.id, user.id]);
  res.json({ message: status === 'paid' ? 'Payment successful.' : status === 'refunded' ? 'Refund successful.' : 'Order cancelled successfully.' });
});

module.exports = router;
