import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api';
import Layout, { Feedback, Panel } from '../components/Layout';

const seatOptions = ['Business-class seat', 'First-class seat', 'Second-class seat', 'Standing ticket'];
const seatColumns: Record<string, [string, string]> = {
  'Business-class seat': ['business_price', 'business_seats'],
  'First-class seat': ['first_price', 'first_seats'],
  'Second-class seat': ['second_price', 'second_seats'],
  'Standing ticket': ['standing_price', 'standing_seats'],
};

export function BookingPage() {
  const params = new URLSearchParams(useLocation().search);
  const navigate = useNavigate();
  const trainId = Number(params.get('train'));
  const initialSeat = params.get('seat') || 'Standing ticket';
  const [train, setTrain] = useState<any>();
  const [passengers, setPassengers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    apiClient.get(`/search/trains/${trainId}`).then((response) => setTrain(response.data.train)).catch(() => setMessage('Train not found.'));
    apiClient.get('/account/passengers').then((response) => setPassengers(response.data.passengers || [])).catch(() => navigate('/login'));
  }, [navigate, trainId]);

  const feedback = (text: string, error = false) => { setMessage(text); setIsError(error); };
  const togglePassenger = (passenger: any) => setSelected((current) => current.some((item) => item.id === passenger.id) ? current.filter((item) => item.id !== passenger.id) : [...current, { ...passenger, seatType: initialSeat, ticketType: 'Adult' }]);
  const updatePassenger = (id: number, key: string, value: string) => setSelected((current) => current.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const placeOrder = async () => {
    if (!selected.length) return feedback('Please select at least one passenger.', true);
    const counts = selected.reduce((map, item) => ({ ...map, [item.seatType]: (map[item.seatType] || 0) + 1 }), {} as Record<string, number>);
    for (const [seatType, count] of Object.entries(counts)) {
      const seats = Number(train[seatColumns[seatType]?.[1]] || 0);
      if (!seatColumns[seatType] || seats < count) return feedback('Sorry, there are no tickets available for the selected ticket class.', true);
    }
    const totalPrice = selected.reduce((sum, item) => sum + Number(train[seatColumns[item.seatType][0]] || 0), 0);
    try {
      const response = await apiClient.post('/orders', { trainId: train.id, passengers: selected, totalPrice });
      feedback(response.data.message);
      window.setTimeout(() => navigate(`/booking/confirm?order=${response.data.order.id}`), 350);
    } catch (error: any) {
      feedback(error.response?.data?.message || 'Unable to submit order.', true);
    }
  };
  if (!train) return <Layout><div className="loading">{message || 'Loading train information...'}</div></Layout>;
  return <Layout><div className="booking-page"><Panel title="Train Information:"><TrainDetail train={train} /><div className="seat-summary">{seatOptions.map((seat, index) => <SeatSummary key={seat} train={train} seat={seat} discount={[32, 24, 27, 27][index]} />)}</div></Panel><Panel title="Passenger Information:"><div className="passenger-picker">{passengers.map((passenger) => <label className={selected.some((item) => item.id === passenger.id) ? 'selected' : ''} key={passenger.id}><input type="checkbox" checked={selected.some((item) => item.id === passenger.id)} onChange={() => togglePassenger(passenger)} />{passenger.name}</label>)}</div><table className="booking-table"><thead><tr>{['Ticket class', 'Ticket type', 'Name', 'ID type', 'ID number', 'Nationality', 'Operation'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{selected.map((passenger) => <tr key={passenger.id}><td><select value={passenger.seatType} onChange={(event) => updatePassenger(passenger.id, 'seatType', event.target.value)}>{seatOptions.map((seat) => <option key={seat}>{seat}</option>)}</select></td><td><select value={passenger.ticketType} onChange={(event) => updatePassenger(passenger.id, 'ticketType', event.target.value)}><option>Adult</option><option>Child</option></select></td><td>{passenger.name}</td><td>Foreign passport</td><td>{passenger.passport_number}</td><td>{passenger.nationality}</td><td><button className="link-button" onClick={() => setSelected((current) => current.filter((item) => item.id !== passenger.id))}>Delete</button></td></tr>)}</tbody></table></Panel><div className="tips"><b>Tips</b><p>A valid ID can be used to purchase only one ticket for the same train on the same date of travel.</p></div><div className="agree-booking"><Link to="/terms">I have read and agree to the Terms of Service</Link></div><Feedback message={message} error={isError} /><div className="action-row"><button className="secondary-button" onClick={() => navigate(-1)}>Previous step</button><button className="orange-button" onClick={placeOrder}>Place order</button></div></div></Layout>;
}

function SeatSummary({ train, seat, discount }: { train: any; seat: string; discount: number }) {
  const [priceKey, seatKey] = seatColumns[seat];
  const remaining = Number(train[seatKey] || 0);
  return <span>{seat.toLowerCase()} ( ￥{Number(train[priceKey]).toFixed(1)} ) <b>{discount}% off</b> {seat === 'Standing ticket' && remaining ? 'Enough' : remaining || 'None'} left</span>;
}

function TrainDetail({ train }: { train: any }) { return <div className="train-detail"><div><strong>{train.train_no}</strong><small>{train.travel_date}</small></div><div><strong>{train.from_station}</strong><small>{train.departure_time}</small></div><span className="journey-arrow">→<small>{Math.floor(train.duration_minutes / 60)}h{train.duration_minutes % 60}m</small></span><div><strong>{train.to_station}</strong><small>{train.arrival_time}</small></div></div>; }

export function ConfirmPage() {
  const orderId = new URLSearchParams(useLocation().search).get('order');
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>();
  useEffect(() => { apiClient.get(`/orders/${orderId}`).then((response) => setOrder(response.data.order)); }, [orderId]);
  if (!order) return <Layout><div className="loading">Loading order...</div></Layout>;
  const passengers = JSON.parse(order.passenger_json);
  return <Layout><div className="modal-backdrop"><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><h2 id="confirm-title">Please confirm the following information.</h2><div className="confirm-detail"><strong>{order.train_no}</strong><span>{order.from_station} {order.departure_time} → {order.to_station} {order.arrival_time}</span><span>Passengers: {passengers.map((passenger: any) => passenger.name).join(', ')}</span><span>Seats: {passengers.map((passenger: any) => passenger.seatType).join(', ')}</span><b>Total: ￥{Number(order.total_price).toFixed(2)}</b></div><div className="action-row"><button className="secondary-button" onClick={() => navigate(`/booking?train=${order.train_id}&seat=${encodeURIComponent(passengers[0]?.seatType || 'Standing ticket')}`)}>Edit</button><button className="orange-button" onClick={() => navigate(`/payment?order=${order.id}&submitted=1`)}>Confirm</button></div></div></div></Layout>;
}

export function PaymentPage() {
  const params = new URLSearchParams(useLocation().search);
  const orderId = params.get('order');
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>();
  const [seconds, setSeconds] = useState(20 * 60);
  const [message, setMessage] = useState(params.get('submitted') ? 'Order submitted successfully.' : '');
  const [isError, setIsError] = useState(false);
  useEffect(() => { apiClient.get(`/orders/${orderId}`).then((response) => setOrder(response.data.order)); const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, [orderId]);
  const updateStatus = async (status: 'paid' | 'cancelled') => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
      setMessage(response.data.message); setIsError(false);
      sessionStorage.setItem('global-notice', response.data.message);
      navigate(status === 'paid' ? '/center/orders?tab=upcoming' : '/center/orders?tab=uncompleted');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Unable to update order.'); setIsError(true);
    }
  };
  if (!order) return <Layout><div className="loading">Loading payment...</div></Layout>;
  const passengers = JSON.parse(order.passenger_json);
  return <Layout><div className="payment-page"><div className="lock-banner"><strong>Seats are locked, Time remained to complete your payment:</strong> <b>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</b></div><Panel title="Order details"><div className="train-detail"><strong>{order.train_no}</strong><span>{order.from_station} {order.departure_time} → {order.to_station} {order.arrival_time}</span></div><table className="order-detail-table"><thead><tr>{['Number', 'name', 'ID type', 'ID number', 'Ticket type', 'Ticket class', 'Coach', 'Seat/berth number', 'Price'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{passengers.map((passenger: any, index: number) => <tr key={`${passenger.id}-${index}`}><td>{index + 1}</td><td>{passenger.name}</td><td>Foreign passport</td><td>{passenger.passport_number}</td><td>{passenger.ticketType}</td><td>{passenger.seatType}</td><td>03</td><td>{passenger.seatType}</td><td>￥{Number(passenger.price || order.total_price / passengers.length).toFixed(2)}</td></tr>)}</tbody></table></Panel><div className="total-box">Total: <b>￥{Number(order.total_price).toFixed(2)}</b></div><div className="tips"><b>Tips</b><p>1. Please complete the online payment within the specified time.<br />2. If the payment is overdue, the system will cancel the transaction.<br />3. You will not be able to purchase additional tickets until you complete the payment or cancel this order.</p></div><Feedback message={message} error={isError} /><div className="action-row"><button className="secondary-button" onClick={() => updateStatus('cancelled')}>Cancel</button><button className="orange-button" onClick={() => updateStatus('paid')}>Pay</button></div></div></Layout>;
}
