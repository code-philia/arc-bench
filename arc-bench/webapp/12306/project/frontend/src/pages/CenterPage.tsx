import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiClient, { getUser, setUser } from '../api';
import Layout, { EmptyState, Feedback, Panel } from '../components/Layout';

type CenterSection = 'home' | 'orders' | 'refund' | 'profile' | 'security' | 'passengers';

export default function CenterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();
  const section = (location.pathname.split('/')[2] || 'home') as CenterSection;

  useEffect(() => {
    if (!user) navigate('/login');
  }, [navigate, user]);

  if (!user) return null;
  const titles: Record<CenterSection, string> = {
    home: 'Personal Center', orders: 'Ticket orders', refund: 'Ticket refund', profile: 'User information',
    security: 'Account security', passengers: 'My Passengers',
  };

  return <Layout><div className="center-layout"><CenterMenu section={section} /><main className="center-main"><div className="breadcrumbs">Current location: &nbsp;&gt; <span>{titles[section]}</span></div>{section === 'orders' && <OrdersPage />}{section === 'refund' && <RefundPage />}{section === 'profile' && <ProfilePage />}{section === 'security' && <SecurityPage />}{section === 'passengers' && <PassengersPage />}{section === 'home' && <CenterHome />}</main></div></Layout>;
}

function CenterMenu({ section }: { section: CenterSection }) {
  return <aside className="center-menu"><h2>Personal Center</h2><Link className={section === 'home' ? 'active' : ''} to="/center">Personal Center</Link><details open={section === 'orders'}><summary>Order center</summary><Link to="/center/orders">Ticket orders</Link></details><details open={section === 'profile' || section === 'security'}><summary>Personal</summary><Link to="/center/profile">User information</Link><Link to="/center/security">Account security</Link><Link to="/center/security?mode=mobile">Verify mobile number</Link></details><details open={section === 'passengers'}><summary>Information management</summary><Link to="/center/passengers">My passengers</Link></details></aside>;
}

function CenterHome() {
  const navigate = useNavigate();
  const user = getUser();
  return <Panel className="notice-panel"><div className="notice-head"><img src="/assets/noticepic.png" alt="" /><h1>{user?.name || user?.username}</h1></div><div className="notice-box"><p>Welcome to 12306.cn.</p><p className="danger-text">If your password is also used in other websites, it is recommended that you modify the password of this website.</p><p>Please verify your e-mail address to <Link to="/center/profile">receive service e-mails</Link> from 12306.</p><p>Please click <button className="link-button" onClick={() => navigate('/search?from=Beijing&to=Shanghai')}>ticket booking</button> to book your tickets.</p></div></Panel>;
}

function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState(new URLSearchParams(location.search).get('tab') || 'uncompleted');
  const [keyword, setKeyword] = useState('');
  const [dateType, setDateType] = useState('Search by booking date');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<any>(null);

  const load = async () => { const response = await apiClient.get('/orders'); setOrders(response.data.orders || []); };
  useEffect(() => { load(); }, []);
  useEffect(() => { const requested = new URLSearchParams(location.search).get('tab'); if (requested) setTab(requested); }, [location.search]);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const inTab = tab === 'uncompleted' ? ['unpaid', 'cancelled'].includes(order.status) : tab === 'upcoming' ? order.status === 'paid' : order.status === 'refunded';
    const text = `${order.order_number} ${order.train_no} ${order.passenger_json}`.toLowerCase();
    const keywordMatches = !keyword || text.includes(keyword.toLowerCase());
    const comparedDate = dateType === 'Search by booking date' ? String(order.booked_at || '').slice(0, 10) : order.travel_date;
    const startMatches = !startDate || comparedDate >= startDate;
    const endMatches = !endDate || comparedDate <= endDate;
    return inTab && keywordMatches && startMatches && endMatches;
  }), [orders, tab, keyword, startDate, endDate, dateType]);

  const chooseTab = (next: string) => { setTab(next); setMessage(''); };
  const search = () => {
    if (keyword.includes('*')) { setMessage('Please enter a valid search condition.'); setIsError(true); return; }
    setMessage(''); setIsError(false); load();
  };
  const cancelOrder = async () => {
    const response = await apiClient.patch(`/orders/${pendingCancel.id}/status`, { status: 'cancelled' });
    setPendingCancel(null); setMessage(response.data.message); setIsError(false); await load();
  };
  const emptyText = tab === 'uncompleted' ? "You don't have uncompleted orders." : "You don't have any bookings or we can't access your bookings at this time.";
  const emptyLink = tab === 'uncompleted' ? 'You can book your tickets and plan your trips.' : 'You can make travel plans through the ticket reservation function.';

  return <div className="orders-view"><div className="tabs"><button className={tab === 'uncompleted' ? 'active' : ''} onClick={() => chooseTab('uncompleted')}>Uncompleted orders</button><button className={tab === 'upcoming' ? 'active' : ''} onClick={() => chooseTab('upcoming')}>Upcoming trips</button><button className={tab === 'history' ? 'active' : ''} onClick={() => chooseTab('history')}>History orders</button></div><div className="order-filters"><select aria-label="Order date type" value={dateType} onChange={(event) => setDateType(event.target.value)}><option>Search by booking date</option><option>Search by departure date</option></select><input aria-label="Start date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /><input aria-label="End date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /><input aria-label="Order number/train number/name" placeholder="Order number/train number/name" value={keyword} onChange={(event) => setKeyword(event.target.value)} /><button className="orange-button" onClick={search}>Search</button></div><Feedback message={message} error={isError} />{filteredOrders.length ? <OrderTable orders={filteredOrders} tab={tab} onCancel={setPendingCancel} /> : <EmptyState text={emptyText} linkText={emptyLink} entryText={tab === 'history' ? 'Search tickets' : undefined} />}{pendingCancel && <ConfirmDialog title="Are you sure you want to cancel this order?" onCancel={() => setPendingCancel(null)} onConfirm={cancelOrder} />}</div>;
}

function OrderTable({ orders, tab, onCancel }: { orders: any[]; tab: string; onCancel: (order: any) => void }) {
  const headings = tab === 'history' ? ['Train Information', 'Passenger Information', 'Seat Information', 'Price', 'Status', 'Total Price'] : ['Train No.', 'Departure date', 'Departure station', 'Arrival station', 'Operation'];
  return <table className="orders-table"><thead><tr>{headings.map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{orders.map((order) => <OrderRow key={order.id} order={order} tab={tab} onCancel={onCancel} />)}</tbody></table>;
}

function OrderRow({ order, tab, onCancel }: { order: any; tab: string; onCancel: (order: any) => void }) {
  const navigate = useNavigate();
  const passengers = JSON.parse(order.passenger_json);
  if (tab === 'history') return <tr><td>{order.train_no} {order.from_station} → {order.to_station}</td><td>{passengers.map((passenger: any) => passenger.name).join(', ')}</td><td>{passengers[0]?.seatType}</td><td>￥{Number(order.total_price).toFixed(2)}</td><td>{order.status}</td><td>￥{Number(order.total_price).toFixed(2)}</td></tr>;
  return <tr><td>{order.train_no}</td><td>{order.travel_date}</td><td>{order.from_station}</td><td>{order.to_station}</td><td><button className="link-button" onClick={() => order.status === 'unpaid' ? navigate(`/payment?order=${order.id}`) : order.status === 'paid' ? navigate(`/center/refund?order=${order.id}`) : null}>{order.status === 'unpaid' ? 'Pay' : order.status === 'paid' ? 'Refund' : 'Cancelled'}</button>{order.status === 'unpaid' && <button className="link-button spaced" onClick={() => onCancel(order)}>Cancel</button>}</td></tr>;
}

function ConfirmDialog({ title, onCancel, onConfirm }: { title: string; onCancel: () => void; onConfirm: () => void }) {
  return <div className="modal-backdrop"><div className="confirm-modal" role="dialog" aria-label={title}><h2>{title}</h2><button className="secondary-button" onClick={onCancel}>Cancel</button><button className="orange-button" onClick={onConfirm}>Confirm</button></div></div>;
}

function RefundPage() {
  const orderId = new URLSearchParams(useLocation().search).get('order');
  const [order, setOrder] = useState<any>();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  useEffect(() => { apiClient.get(`/orders/${orderId}`).then((response) => setOrder(response.data.order)).catch(() => { setMessage('Order not found.'); setIsError(true); }); }, [orderId]);
  const refund = async () => { try { const response = await apiClient.patch(`/orders/${orderId}/status`, { status: 'refunded' }); setOrder((current: any) => ({ ...current, status: 'refunded' })); setMessage(response.data.message); setIsError(false); } catch (error: any) { setMessage(error.response?.data?.message || 'Unable to refund order.'); setIsError(true); } };
  if (!order) return <div className="refund-page"><Feedback message={message || 'Loading refund information...'} error={isError} /></div>;
  return <div className="refund-page"><Panel title="Refund information"><div className="refund-detail"><p><b>Order:</b> {order.order_number}</p><p><b>Train:</b> {order.train_no} {order.from_station} → {order.to_station}</p><p><b>Departure date:</b> {order.travel_date}</p><p><b>Refund amount:</b> ￥{Number(order.total_price).toFixed(2)}</p><p><b>Status:</b> {order.status}</p></div></Panel><Feedback message={message} error={isError} /><div className="action-row">{order.status === 'refunded' ? <Link className="orange-button action-link" to="/center/orders?tab=history">View History orders</Link> : <><Link className="secondary-button action-link" to="/center/orders?tab=upcoming">Cancel</Link><button className="orange-button" onClick={refund}>Confirm refund</button></>}</div></div>;
}

function ProfilePage() {
  const initial = getUser() || {};
  const [user, setLocalUser] = useState<any>(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ gender: initial.gender || 'Male', email: initial.email || '', passengerType: initial.passenger_type || 'Adult', password: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const save = async () => { try { const response = await apiClient.patch('/account/profile', form); setLocalUser(response.data.user); setUser(response.data.user); setEditing(null); setForm((current) => ({ ...current, password: '' })); setMessage('Information updated successfully.'); setIsError(false); } catch (error: any) { setMessage(error.response?.data?.message || 'Unable to update information.'); setIsError(true); } };
  const setValue = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="profile-view"><Feedback message={message} error={isError} /><Panel title="Essential information"><EditButton editing={editing === 'essential'} onClick={() => editing === 'essential' ? save() : setEditing('essential')} /><ProfileRow label="Account number" value={user.username} /><ProfileRow label="Name" value={user.name} /><ProfileRow label="Gender" value={user.gender} editing={editing === 'essential'} control={<span><label><input type="radio" name="profileGender" checked={form.gender === 'Male'} onChange={() => setValue('gender', 'Male')} /> Male</label><label><input type="radio" name="profileGender" checked={form.gender === 'Female'} onChange={() => setValue('gender', 'Female')} /> Female</label></span>} /><ProfileRow label="Nationality" value={user.nationality} /><ProfileRow label="ID type" value="Foreign passport" /><ProfileRow label="ID number" value={user.passport_number} />{editing === 'essential' && <label className="profile-password">Password<input aria-label="Password" type="password" value={form.password} onChange={(event) => setValue('password', event.target.value)} /></label>}</Panel><Panel title="Contact information"><EditButton editing={editing === 'contact'} onClick={() => editing === 'contact' ? save() : setEditing('contact')} /><ProfileRow label="Email" value={user.email} editing={editing === 'contact'} control={<input aria-label="Email" value={form.email} onChange={(event) => setValue('email', event.target.value)} />} /></Panel><Panel title="Additional information"><EditButton editing={editing === 'additional'} onClick={() => editing === 'additional' ? save() : setEditing('additional')} /><ProfileRow label="Passenger type" value={user.passenger_type} editing={editing === 'additional'} control={<select aria-label="Passenger type" value={form.passengerType} onChange={(event) => setValue('passengerType', event.target.value)}><option>Adult</option><option>Child</option></select>} /></Panel></div>;
}

function EditButton({ editing, onClick }: { editing: boolean; onClick: () => void }) { return <button className="edit-button" onClick={onClick}>{editing ? 'Save' : 'Edit'}</button>; }
function ProfileRow({ label, value, editing = false, control }: { label: string; value: string; editing?: boolean; control?: ReactNode }) { return <div className="profile-row"><span>{label}</span>{editing && control ? control : <b>{value || '-'}</b>}</div>; }

function SecurityPage() {
  const mode = new URLSearchParams(useLocation().search).get('mode');
  const [active, setActive] = useState(mode || '');
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '', email: '', password: '', mobile: '', region: '+86' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const user = getUser();
  useEffect(() => setActive(mode || ''), [mode]);
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    try {
      const endpoint = active === 'password' ? '/account/password' : active === 'email' ? '/account/email' : '/account/mobile';
      const body = active === 'password' ? { currentPassword: form.currentPassword, newPassword: form.newPassword, confirmPassword: form.confirmPassword } : active === 'email' ? { email: form.email, password: form.password } : { mobile: form.mobile, region: form.region, password: form.password };
      const response = await apiClient.post(endpoint, body);
      if (response.data.user) setUser(response.data.user);
      setMessage(response.data.message); setIsError(false); setActive('');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Unable to update security details.'); setIsError(true);
    }
  };
  return <div className="security-view"><Feedback message={message} error={isError} /><Panel title="Login password"><button className="edit-button" onClick={() => setActive('password')}>Login password</button>{active === 'password' && <div className="form-stack security-form"><Field label="Current password" type="password" value={form.currentPassword} onChange={(value) => update('currentPassword', value)} /><Field label="New password" type="password" value={form.newPassword} onChange={(value) => update('newPassword', value)} /><Field label="Confirm your password" type="password" value={form.confirmPassword} onChange={(value) => update('confirmPassword', value)} /></div>}</Panel><Panel title="Security mailbox"><button className="edit-button" onClick={() => setActive('email')}>Security mailbox</button>{active === 'email' && <div className="form-stack security-form"><label>Current email address: <input aria-label="Current email address" value={user?.email || ''} readOnly /></label><Field label="New e-mail" placeholder="Please enter a new email address." value={form.email} onChange={(value) => update('email', value)} /><Field label="Confirm your password" type="password" placeholder="Correct password input to modify personal information." value={form.password} onChange={(value) => update('password', value)} /></div>}</Panel><Panel title="Mobile number"><button className="edit-button" onClick={() => setActive('mobile')}>Mobile number</button>{active === 'mobile' && <div className="form-stack security-form"><div className="old-mobile">old mobile number: (+86) ****{user?.mobile ? String(user.mobile).slice(-4) : '0000'}</div><label>new mobile number: <span className="mobile-input"><select aria-label="Region code" value={form.region} onChange={(event) => update('region', event.target.value)}><option value="+86">(+86)</option><option value="+1">(+1)</option><option value="+44">(+44)</option></select><input aria-label="new mobile number" placeholder="new mobile number." value={form.mobile} onChange={(event) => update('mobile', event.target.value)} /></span></label><Field label="Confirm your password" type="password" placeholder="Please enter the login password." value={form.password} onChange={(value) => update('password', value)} /></div>}</Panel>{active && <div className="action-row"><button className="secondary-button" onClick={() => setActive('')}>Cancel</button><button className="orange-button" onClick={submit}>Determine</button></div>}</div>;
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return <label>{label}: <input aria-label={label} placeholder={placeholder} type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function PassengersPage() {
  const [passengers, setPassengers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [dialog, setDialog] = useState<'one' | 'many' | null>(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [form, setForm] = useState<any>({ nationality: '', name: '', passportNumber: '', passportExpirationDate: '', birthDate: '', gender: 'Male', email: '', mobile: '', passengerType: 'Adult' });
  const load = () => apiClient.get('/account/passengers').then((response) => setPassengers(response.data.passengers || []));
  useEffect(() => { load(); }, []);
  const shown = passengers.filter((passenger) => `${passenger.name} ${passenger.passport_number}`.toLowerCase().includes(query.toLowerCase()));
  const setValue = (key: string, value: string) => setForm((current: any) => ({ ...current, [key]: value }));
  const add = async (event: FormEvent) => { event.preventDefault(); try { const response = await apiClient.post('/account/passengers', form); setMessage(response.data.message); setIsError(false); setShowForm(false); await load(); } catch (error: any) { setMessage(error.response?.data?.message || 'Unable to add passenger.'); setIsError(true); } };
  const remove = async () => { try { const ids = dialog === 'one' ? [selected[0]] : selected; const response = await apiClient.delete('/account/passengers', { data: { ids } }); setMessage(response.data.message); setIsError(false); setDialog(null); setSelected([]); await load(); } catch (error: any) { setMessage(error.response?.data?.message || 'Unable to delete passenger.'); setIsError(true); } };
  return <div className="passengers-view"><Feedback message={message} error={isError} /><div className="passenger-toolbar"><input aria-label="Name" placeholder="Please enter passenger name" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="orange-button" onClick={load}>Search</button><button className="link-button" aria-label="Clear search" onClick={() => { setQuery(''); load(); }}>×</button></div><table className="passenger-table"><thead><tr><th><input type="checkbox" aria-label="All" onChange={(event) => setSelected(event.target.checked ? shown.filter((passenger) => !passenger.is_owner).map((passenger) => passenger.id) : [])} /> All</th><th>Name</th><th>ID type</th><th>ID number</th><th>Mobile number</th><th>Operation</th></tr></thead><tbody>{shown.map((passenger) => <tr key={passenger.id}><td><input type="checkbox" disabled={passenger.is_owner} checked={selected.includes(passenger.id)} onChange={(event) => setSelected(event.target.checked ? [...selected, passenger.id] : selected.filter((id) => id !== passenger.id))} /></td><td>{passenger.name}</td><td>Foreign passport</td><td>{passenger.passport_number}</td><td>{passenger.mobile}</td><td>{!passenger.is_owner && <button className="link-button" onClick={() => { setSelected([passenger.id]); setDialog('one'); }}>Delete</button>}</td></tr>)}</tbody></table><div className="passenger-actions"><button className="secondary-button" onClick={() => setShowForm(true)}>Add new passengers</button><button className="secondary-button" disabled={!selected.length} onClick={() => setDialog('many')}>Batch deletion</button></div>{showForm && <PassengerForm form={form} setValue={setValue} onSubmit={add} onCancel={() => setShowForm(false)} />}{dialog && <ConfirmDialog title={dialog === 'one' ? 'Are you sure you want to delete this passenger?' : 'Are you sure you want to delete the selected passengers?'} onCancel={() => setDialog(null)} onConfirm={remove} />}</div>;
}

function PassengerForm({ form, setValue, onSubmit, onCancel }: { form: any; setValue: (key: string, value: string) => void; onSubmit: (event: FormEvent) => void; onCancel: () => void }) {
  const fields = [['nationality', 'Nationality', 'select'], ['name', 'Name', 'text'], ['passportNumber', 'Passport number', 'text'], ['passportExpirationDate', 'Passport expiration date', 'date'], ['birthDate', 'Date of birth', 'date'], ['email', 'Email address', 'email'], ['mobile', 'Mobile number', 'text']];
  return <div className="modal-backdrop"><div className="form-modal" role="dialog" aria-label="Add new passengers"><h2>Add new passengers</h2><form noValidate onSubmit={onSubmit} className="form-grid">{fields.map(([key, label, type]) => <label key={key}>{label}{type === 'select' ? <select aria-label={label} value={form[key]} onChange={(event) => setValue(key, event.target.value)}><option value="">Please select</option><option>China</option><option>United States</option><option>Vietnam</option></select> : <input aria-label={label} type={type} value={form[key]} onChange={(event) => setValue(key, event.target.value)} />}</label>)}<fieldset><legend>Gender</legend><label><input type="radio" name="passengerGender" checked={form.gender === 'Male'} onChange={() => setValue('gender', 'Male')} /> Male</label><label><input type="radio" name="passengerGender" checked={form.gender === 'Female'} onChange={() => setValue('gender', 'Female')} /> Female</label></fieldset><label>Passenger type<select aria-label="Passenger type" value={form.passengerType} onChange={(event) => setValue('passengerType', event.target.value)}><option>Adult</option><option>Child</option></select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button><button className="orange-button" type="submit">Determine</button></div></form></div></div>;
}
