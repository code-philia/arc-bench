import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import { Feedback } from './Layout';

export type SearchValues = { from: string; to: string; date: string };

const today = new Date();
const iso = (date: Date) => date.toISOString().slice(0, 10);
const cities = ['Beijing', 'Shanghai', 'Yancheng', 'Lhasa', 'Guangzhou', 'Nanjing', 'Hangzhou', 'Chengdu'];
const stationCities: Record<string, string> = { 'Shanghai Hongqiao': 'Shanghai', 'Beijing South': 'Beijing' };
const cityLabels: Record<string, string> = {
  Beijing: '北京',
  Shanghai: '上海',
  Yancheng: '盐城',
  Lhasa: '拉萨',
  Guangzhou: '广州',
  Nanjing: '南京',
  Hangzhou: '杭州',
  Chengdu: '成都',
};

function normalizeCity(value: string) {
  const name = value.replace(/\(.+\)/, '').trim();
  return stationCities[name] || name;
}

export default function SearchBox({
  initial = { from: '', to: '', date: iso(today) },
  compact = false,
}: {
  initial?: SearchValues;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const [values, setValues] = useState(initial);
  const [active, setActive] = useState<'from' | 'to' | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [tab, setTab] = useState('Popular');
  const [message, setMessage] = useState('');

  useEffect(() => setValues(initial), [initial.from, initial.to, initial.date]);
  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(() => {
      apiClient.get('/search/locations', { params: { q: values[active] } }).then((res) => setLocations(res.data.locations));
    }, 100);
    return () => window.clearTimeout(timer);
  }, [active, values]);

  const update = (key: keyof SearchValues, value: string) => setValues((prev) => ({ ...prev, [key]: value }));
  const isValidCity = (value: string) => cities.some((city) => normalizeCity(value).toLowerCase() === city.toLowerCase() || value.includes(cityLabels[city])) || Object.keys(stationCities).some((station) => normalizeCity(value).toLowerCase() === stationCities[station].toLowerCase() && value.toLowerCase().includes(station.toLowerCase()));
  const submit = () => {
    if (!values.from) return setMessage('Please enter a valid departure place.');
    if (!values.to) return setMessage('Please enter a valid arrival place.');
    navigate(`/search?from=${encodeURIComponent(normalizeCity(values.from))}&to=${encodeURIComponent(normalizeCity(values.to))}&date=${values.date}`);
  };
  const choose = (item: any) => { update(active!, `${item[0]} (${item[1]})`); setActive(null); };
  const dates = Array.from({ length: 15 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return iso(d); });

  return <div className={`search-box ${compact ? 'compact' : ''}`}>
    {!compact && <div className="service-note">* The 12306.cn website provides information query and ticket refund services 24 hours a day, and ticket sales and endorsement services from 5:00 to 1:00 the next day.</div>}
    <div className="search-fields">
      <div className="field location-field" onClick={() => setActive('from')}><label onClick={() => setActive('from')}>From<input aria-label="From" placeholder="From" value={values.from} onFocus={() => setActive('from')} onChange={(e) => { update('from', e.target.value); setActive('from'); }} /></label>{active === 'from' && <LocationPopup locations={locations} tab={tab} setTab={setTab} choose={choose} />}</div>
      <button className="swap" type="button" aria-label="Swap stations" onClick={() => setValues({ ...values, from: values.to, to: values.from })}>↔</button>
      <div className="field location-field" onClick={() => setActive('to')}><label onClick={() => setActive('to')}>To<input aria-label="To" placeholder="To" value={values.to} onFocus={() => setActive('to')} onChange={(e) => { update('to', e.target.value); setActive('to'); }} /></label>{active === 'to' && <LocationPopup locations={locations} tab={tab} setTab={setTab} choose={choose} />}</div>
      <div className="field date-field"><label>Date<input aria-label="Date" placeholder="Date" type="date" value={values.date} onChange={(e) => update('date', e.target.value)} min={dates[0]} max={dates[14]} /></label></div>
      <button className="orange-button search-button" onClick={submit}>Search</button>
    </div>
    {!compact && <label className="check-row"><input type="checkbox" /> High-speed trains only</label>}
    <Feedback message={message} error />
  </div>;
}

function LocationPopup({ locations, tab, setTab, choose }: { locations: any[]; tab: string; setTab: (value: string) => void; choose: (item: any) => void }) {
  const tabs = ['Popular', 'ABCDE', 'FGHIJ', 'KLMNO', 'PQRST', 'UVWXYZ'];
  const items = locations.length ? locations : [['Beijing', '北京'], ['Shanghai', '上海'], ['Yancheng', '盐城']];
  const sourceItems = items.filter((item) => tab === 'Popular' || tabMatches(item[0], tab));
  return <div className="location-popup"><div className="popup-tabs">{tabs.map((item) => <button className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}</button>)}</div><h4>Top destinations</h4><h5>Popular</h5>{sourceItems.map((item) => <button className="location-item" key={item[0]} onClick={() => choose(item)}><span>{item[0]}</span><b>{item[1]}</b></button>)}</div>;
}

function tabMatches(value: string, tab: string): boolean {
  const first = String(value || '').trim().toUpperCase()[0] || '';
  const ranges: Record<string, string> = { ABCDE: 'ABCDE', FGHIJ: 'FGHIJ', KLMNO: 'KLMNO', PQRST: 'PQRST', UVWXYZ: 'UVWXYZ' };
  return Boolean(ranges[tab]?.includes(first));
}
