import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient, { getUser } from '../api';
import Layout from '../components/Layout';
import SearchBox from '../components/SearchBox';
import { QuickLogin } from './AuthPages';

type Filters = { type: string; fromStation: string; toStation: string; timeRange: string };
type PendingBooking = { train: any; seatType: string } | null;

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
const stationLabels: Record<string, string> = {
  Shanghaihongqiao: 'Shanghai Hongqiao',
  Beijingnan: 'Beijing South',
};

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initial = {
    from: params.get('from') || 'Beijing',
    to: params.get('to') || 'Shanghai',
    date: params.get('date') || new Date().toISOString().slice(0, 10),
  };
  const [data, setData] = useState<any>({ trains: [] });
  const [filters, setFilters] = useState<Filters>({ type: '', fromStation: '', toStation: '', timeRange: '' });
  const [sort, setSort] = useState({ key: '', direction: 'asc' });
  const [pendingBooking, setPendingBooking] = useState<PendingBooking>(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    apiClient.get('/search/trains', {
      params: { ...initial, ...filters, sort: sort.key, direction: sort.direction },
    }).then((response) => {
      if (currentRequest === requestId.current) setData(response.data);
    }).finally(() => {
      if (currentRequest === requestId.current) setLoading(false);
    });
  }, [location.search, filters, sort]);

  const setFilter = (key: keyof Filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const toggleSort = (key: string) => setSort((current) => ({
    key,
    direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
  }));
  const continueBooking = (train: any, seatType: string) => navigate(`/booking?train=${train.id}&seat=${encodeURIComponent(seatType)}&from=${encodeURIComponent(initial.from)}&to=${encodeURIComponent(initial.to)}&date=${initial.date}`);
  const book = (train: any, seatType: string) => {
    if (!getUser()) {
      setPendingBooking({ train, seatType });
      return;
    }
    continueBooking(train, seatType);
  };
  const dates = Array.from({ length: 5 }, (_, index) => {
    const date = new Date(`${initial.date}T00:00:00`);
    date.setDate(date.getDate() + index);
    return date;
  });
  const trains = useMemo(() => data.trains || [], [data]);
  const visibleTrains = useMemo(() => {
    if (!sort.key) return trains;
    const value = (train: any) => sort.key === 'travel' ? Number(train.duration_minutes) : String(train[sort.key === 'departure' ? 'departure_time' : 'arrival_time']);
    return [...trains].sort((a, b) => {
      const left = value(a); const right = value(b);
      const comparison = typeof left === 'number' ? left - (right as number) : String(left).localeCompare(String(right));
      return sort.direction === 'desc' ? -comparison : comparison;
    });
  }, [trains, sort]);

  return (
    <Layout>
      <div className="results-layout">
        <FilterSidebar data={data} filters={filters} setFilter={setFilter} />
        <main className="results-main">
          <SearchBox compact initial={initial} />
          <div className="date-bar">
            {dates.map((date) => {
              const value = date.toISOString().slice(0, 10);
              const url = `/search?from=${encodeURIComponent(initial.from)}&to=${encodeURIComponent(initial.to)}&date=${value}`;
              return <button className={value === initial.date ? 'active' : ''} key={value} onClick={() => navigate(url)}>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}</button>;
            })}
          </div>
          <div className="route-summary"><strong>{initial.from} ({cityLabels[initial.from] || initial.from})</strong><span>→</span><strong>{initial.to} ({cityLabels[initial.to] || initial.to})</strong><em>{data.transfer ? 'Transfer' : `${trains.length} results`}</em></div>
          {loading ? <div className="loading">Searching trains...</div> : data.transfer ? <TransferPlans from={initial.from} to={initial.to} date={initial.date} book={book} /> : visibleTrains.length ? <TrainTable trains={visibleTrains} toggleSort={toggleSort} book={book} /> : <EmptyResults />}
        </main>
      </div>
      {pendingBooking && <QuickLogin onClose={() => setPendingBooking(null)} onSuccess={() => continueBooking(pendingBooking.train, pendingBooking.seatType)} />}
    </Layout>
  );
}

function FilterSidebar({ data, filters, setFilter }: { data: any; filters: Filters; setFilter: (key: keyof Filters, value: string) => void }) {
  return <aside className="filter-sidebar"><h2>Filter</h2><FilterChecks title="Train type" options={['All', 'G/C/D', 'Other']} value={filters.type} onChange={(value) => setFilter('type', value)} /><FilterChecks title="From Station" options={['All', ...(data.locations?.from || [])]} value={filters.fromStation} onChange={(value) => setFilter('fromStation', value)} /><FilterChecks title="To Station" options={['All', ...(data.locations?.to || [])]} value={filters.toStation} onChange={(value) => setFilter('toStation', value)} /><label className="filter-label">Departure time<select aria-label="Departure time" value={filters.timeRange} onChange={(event) => setFilter('timeRange', event.target.value)}><option value="">00:00-24:00</option><option>00:00-06:00</option><option>06:00-12:00</option><option>12:00-18:00</option><option>18:00-24:00</option></select></label></aside>;
}

function FilterChecks({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  const selected = value ? value.split(',') : [];
  const update = (option: string) => {
    if (option === 'All') return onChange('');
    const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
    onChange(next.join(','));
  };
  return <fieldset className="filter-group"><legend>{title}</legend>{options.map((option) => <label key={option}><input type="checkbox" checked={option === 'All' ? !value : selected.includes(option)} onChange={() => update(option)} />{option}</label>)}</fieldset>;
}

function TrainTable({ trains, toggleSort, book }: { trains: any[]; toggleSort: (key: string) => void; book: (train: any, seatType: string) => void }) {
  return <table className="train-table"><thead><tr><th>Train No.</th><th><button onClick={() => toggleSort('departure')}>Departure Time ↕</button></th><th><button onClick={() => toggleSort('travel')}>Travel time ↕</button></th><th><button onClick={() => toggleSort('arrival')}>Arrival Time ↕</button></th><th>Price</th></tr></thead><tbody>{trains.map((train) => <TrainRow key={train.id} train={train} book={book} />)}</tbody></table>;
}

function TrainRow({ train, book }: { train: any; book: (train: any, seatType: string) => void }) {
  const seats = [['business-class seat', train.business_price, train.business_seats, 'Business-class seat'], ['first-class seat', train.first_price, train.first_seats, 'First-class seat'], ['second-class seat', train.second_price, train.second_seats, 'Second-class seat'], ['standing ticket', train.standing_price, train.standing_seats, 'Standing ticket']];
  return <tr><td><a href="#booking">{train.train_no}</a><small>{stationLabels[train.from_station] || train.from_station}</small></td><td><b>{train.departure_time}</b></td><td>{Math.floor(train.duration_minutes / 60)}h{train.duration_minutes % 60}m</td><td><b>{train.arrival_time}</b><small>{stationLabels[train.to_station] || train.to_station}</small></td><td>{seats.map(([name, price, remaining, seatType]) => <div className="price-line" key={String(name)}><span>{name} <b>￥{Number(price).toFixed(1)}</b></span><button className="book-button" disabled={!remaining} onClick={() => book(train, String(seatType))}>{remaining ? 'Book' : 'Sold out'}</button></div>)}</td></tr>;
}

function EmptyResults() { return <div className="empty-results"><img src="/assets/empty.png" alt="" /><h2>0 results</h2><p>sorry, according to your inquiry condition, there is no train at present.</p></div>; }

function TransferPlans({ from, to, date, book }: { from: string; to: string; date: string; book: (train: any, seatType: string) => void }) {
  const [sort, setSort] = useState('');
  const [direction, setDirection] = useState('asc');
  const [plans, setPlans] = useState<any[]>([]);
  const requestId = useRef(0);
  useEffect(() => {
    const currentRequest = ++requestId.current;
    apiClient.get('/search/transfers', { params: { from, to, date, sort, direction } }).then((response) => {
      if (currentRequest === requestId.current) setPlans(response.data.plans);
    });
  }, [from, to, date, sort, direction]);
  const chooseSort = (key: string) => {
    const nextDirection = sort === key && direction === 'asc' ? 'desc' : 'asc';
    setDirection(nextDirection);
    setSort(key);
    const value = (plan: any) => key === 'travel' ? Number(plan.total) : key === 'departure' ? clockMinutes(plan.first.departure) : clockMinutes(plan.second.arrival);
    setPlans((current) => [...current].sort((a, b) => (value(a) - value(b)) * (nextDirection === 'desc' ? -1 : 1)));
  };
  const visiblePlans = useMemo(() => {
    const value = (plan: any) => sort === 'travel' ? Number(plan.total) : sort === 'departure' ? clockMinutes(plan.first.departure) : clockMinutes(plan.second.arrival);
    return [...plans].sort((a, b) => (value(a) - value(b)) * (direction === 'desc' ? -1 : 1));
  }, [plans, sort, direction]);
  return <div className="transfer-list"><div className="transfer-header"><h2>Transfer journeys</h2><div><button onClick={() => chooseSort('departure')}>Departure Time</button><button onClick={() => chooseSort('travel')}>Travel time</button><button onClick={() => chooseSort('arrival')}>Arrival Time</button></div></div>{visiblePlans.slice(0, 10).map((plan) => <article className="transfer-plan" data-departure={plan.first.departure} data-travel={plan.total} data-arrival={plan.second.arrival} data-wait={plan.waitMinutes} key={plan.id}><div><b>{plan.first.trainNo}</b><span>{plan.first.from} {plan.first.departure} → {plan.first.to} {plan.first.arrival}</span><small>{plan.first.travel} · ￥{plan.first.price}</small></div><div className="transfer-wait">Transfer waiting {plan.wait}</div><div><b>{plan.second.trainNo}</b><span>{plan.second.from} {plan.second.departure} → {plan.second.to} {plan.second.arrival}</span><small>{plan.second.travel} · ￥{plan.second.price}</small></div><strong className="transfer-total">Total travel time: {plan.total} minutes</strong><button className="book-button" onClick={() => book({ id: plan.trainId, transferPlan: plan }, 'Second-class seat')}>Book</button></article>)}</div>;
}

function clockMinutes(value: string): number {
  const [hours, minutes] = String(value).split(':').map(Number);
  return hours * 60 + minutes;
}
