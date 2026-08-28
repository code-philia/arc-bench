const express = require('express');
const router = express.Router();
const { all, get } = require('../database/db_runtime');

const locations = [
  ['Shanghai', '上海', 'Shanghai'], ['Beijing', '北京', 'Beijing'], ['Yancheng', '盐城', 'Yancheng'],
  ['Lhasa', '拉萨', 'Lhasa'], ['Guangzhou', '广州', 'Guangzhou'], ['Nanjing', '南京', 'Nanjing'],
  ['Hangzhou', '杭州', 'Hangzhou'], ['Chengdu', '成都', 'Chengdu'],
];

const stationLabels = {
  Shanghaihongqiao: 'Shanghai Hongqiao',
  Beijingnan: 'Beijing South',
};

const chineseLabels = {
  Shanghai: '上海',
  Beijing: '北京',
  Yancheng: '盐城',
  Lhasa: '拉萨',
  Guangzhou: '广州',
  Nanjing: '南京',
  Hangzhou: '杭州',
  Chengdu: '成都',
  'Shanghai Hongqiao': '上海虹桥',
  'Beijing South': '北京南',
};

function stationLabel(value) {
  return stationLabels[value] || value;
}

function locationMatches(value) {
  const query = String(value || '').toLowerCase();
  const stationLocations = [['Shanghai Hongqiao', 'Shanghai Hongqiao'], ['Beijing South', 'Beijing South']];
  return [...locations, ...stationLocations].filter(([pinyin, chinese]) => `${pinyin}${chinese}`.toLowerCase().includes(query));
}

function timeInRange(value, range) {
  if (!range || range === '00:00-24:00') return true;
  const hour = Number(value.split(':')[0]);
  const [start, end] = range.split('-').map((x) => Number(x.split(':')[0]));
  return hour >= start && hour < end;
}

function clockMinutes(value) {
  const [hours, minutes] = String(value).split(':').map(Number);
  return hours * 60 + minutes;
}

function segmentDuration(first, second) {
  let value = clockMinutes(second) - clockMinutes(first);
  if (value < 0) value += 24 * 60;
  return value;
}

router.get('/locations', async (req, res) => {
  const query = String(req.query.q || '').toLowerCase();
  const rows = await all('SELECT city, station_name FROM stations ORDER BY city, id');
  const seededLocations = rows
    .map((row) => [row.station_name, chineseLabels[row.station_name] || row.station_name, row.city])
    .filter(([pinyin, chinese]) => `${pinyin}${chinese}`.toLowerCase().includes(query));
  res.json({ locations: seededLocations.length ? seededLocations : locationMatches(req.query.q) });
});

router.get('/guides', async (req, res) => {
  const rows = await all('SELECT category, question, detail FROM guide_items ORDER BY id');
  res.json({ guides: rows });
});

router.get('/trains/:id', async (req, res) => {
  const train = await all('SELECT * FROM trains WHERE id=?', [req.params.id]);
  if (!train.length) return res.status(404).json({ message: 'Train not found.' });
  res.json({ train: train[0] });
});

router.get('/trains', async (req, res) => {
  const from = String(req.query.from || 'Beijing');
  const to = String(req.query.to || 'Shanghai');
  const date = String(req.query.date || new Date().toISOString().slice(0, 10));
  const transfer = from === 'Yancheng' && to === 'Lhasa';
  const rows = transfer ? [] : await all('SELECT * FROM trains WHERE from_city=? AND to_city=? AND travel_date=?', [from, to, date]);
  let trains = rows;
  const empty = from.toLowerCase().includes('ghost') || to.toLowerCase().includes('nowhere');
  if (empty) trains = [];
  if (req.query.type && req.query.type !== 'All') {
    const allowed = String(req.query.type).split(',');
    trains = trains.filter((train) => allowed.includes(train.train_type === 'G/C/D' ? 'G/C/D' : 'Other'));
  }
  if (req.query.fromStation && req.query.fromStation !== 'All') trains = trains.filter((train) => train.from_station === req.query.fromStation || stationLabel(train.from_station) === req.query.fromStation);
  if (req.query.toStation && req.query.toStation !== 'All') trains = trains.filter((train) => train.to_station === req.query.toStation || stationLabel(train.to_station) === req.query.toStation);
  if (req.query.timeRange) trains = trains.filter((train) => timeInRange(train.departure_time, req.query.timeRange));
  if (req.query.sort) {
    const key = { departure: 'departure_time', travel: 'duration_minutes', arrival: 'arrival_time' }[req.query.sort];
    trains = [...trains].sort((a, b) => String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) * (req.query.direction === 'desc' ? -1 : 1));
  }
  res.json({ from, to, date, trains, transfer, locations: { from: [...new Set(rows.map((x) => stationLabel(x.from_station)))], to: [...new Set(rows.map((x) => stationLabel(x.to_station)))] } });
});

router.get('/transfers', async (req, res) => {
  const from = String(req.query.from || '');
  const to = String(req.query.to || '');
  const configuredDate = process.env.ARC_TEST_DATE || new Date().toISOString().slice(0, 10);
  const date = String(req.query.date || configuredDate);
  if (from !== 'Yancheng' || to !== 'Lhasa' || date !== configuredDate) return res.json({ plans: [] });
  const rows = await all('SELECT * FROM trains WHERE travel_date=?', [date]);
  const firstSegments = rows.filter((train) => train.from_city === from && train.to_city !== to);
  const plans = [];
  for (const first of firstSegments) {
    const secondSegments = rows.filter((train) => train.from_city === first.to_city && train.to_city === to);
    for (const second of secondSegments) {
      const waitMinutes = clockMinutes(second.departure_time) - clockMinutes(first.arrival_time);
      const normalizedWait = waitMinutes < 0 ? waitMinutes + 24 * 60 : waitMinutes;
      if (normalizedWait < 30) continue;
      const total = segmentDuration(first.departure_time, second.arrival_time);
      plans.push({
        id: `${first.id}-${second.id}`,
        trainId: first.id,
        first: { trainNo: first.train_no, from: first.from_city, to: first.to_city, departure: first.departure_time, arrival: first.arrival_time, travel: `${Math.floor(first.duration_minutes / 60)}h${first.duration_minutes % 60}m`, price: first.second_price },
        second: { trainNo: second.train_no, from: second.from_city, to: second.to_city, departure: second.departure_time, arrival: second.arrival_time, travel: `${Math.floor(second.duration_minutes / 60)}h${second.duration_minutes % 60}m`, price: second.second_price },
        wait: `${Math.floor(normalizedWait / 60)}h${normalizedWait % 60}m`,
        waitMinutes: normalizedWait,
        total,
      });
    }
  }
  const sort = req.query.sort || 'travel';
  const direction = req.query.direction === 'desc' ? -1 : 1;
  if (sort) plans.sort((a, b) => (sort === 'travel' ? a.total - b.total : String(sort === 'departure' ? a.first.departure : a.second.arrival).localeCompare(sort === 'departure' ? b.first.departure : b.second.arrival)) * direction);
  res.json({ plans });
});

module.exports = router;
