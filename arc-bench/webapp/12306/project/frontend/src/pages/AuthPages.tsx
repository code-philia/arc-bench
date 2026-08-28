import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient, { setUser } from '../api';
import Layout, { Feedback, Panel } from '../components/Layout';

const initialRegistration = {
  nationality: '',
  name: '',
  passportNumber: '',
  passportExpirationDate: '',
  birthDate: '',
  gender: 'Male',
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  mobile: '',
  agreement: false,
};

export function LoginPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!account.trim() || !password) {
      setMessage('Please enter your username/email/phone number and password.');
      setIsError(true);
      return;
    }
    try {
      const response = await apiClient.post('/auth/login', { account, password });
      setUser(response.data.user);
      setMessage(response.data.message);
      setIsError(false);
      window.setTimeout(() => navigate('/'), 350);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Unable to login.');
      setIsError(true);
    }
  };

  return <Layout><div className="auth-wrap"><Panel title="Login"><form noValidate onSubmit={submit} className="form-stack"><input aria-label="Email/Username/Mobile number" placeholder="Email/Username/Mobile number" value={account} onChange={(event) => setAccount(event.target.value)} /><input aria-label="Password" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /><button className="orange-button" type="submit">LOGIN</button><div className="auth-links"><Link to="/forgot-password">Forgot password?</Link><Link to="/register">No account yet? Register now.</Link></div><Feedback message={message} error={isError} /></form></Panel></div></Layout>;
}

export function QuickLogin({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await apiClient.post('/auth/login', { account, password });
      setUser(response.data.user);
      onClose();
      onSuccess?.();
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Unable to login.');
    }
  };

  return <div className="modal-backdrop"><div className="quick-login"><button className="close-button" onClick={onClose}>x</button><img src="/assets/logo-icon.png" alt="" /><h2>Login</h2><form onSubmit={submit} className="form-stack"><input aria-label="Email/Username/Mobile number" placeholder="Email/Username/Mobile number" value={account} onChange={(event) => setAccount(event.target.value)} /><input aria-label="Password" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /><button className="orange-button" type="submit">LOGIN</button><Link to="/forgot-password">Forgot password?</Link><Link to="/register">No account yet? Register now.</Link><Feedback message={message} error /></form></div></div>;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialRegistration);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const update = (key: string, value: any) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => { event.preventDefault(); try { const response = await apiClient.post('/auth/register', form); sessionStorage.setItem('global-notice', response.data.message); navigate('/login'); } catch (error: any) { setMessage(error.response?.data?.message || 'Unable to register account.'); setIsError(true); } };

  const fields = [['nationality', 'Nationality', 'select'], ['name', 'Name', 'text'], ['passportNumber', 'Passport number', 'text'], ['passportExpirationDate', 'Passport expiration date', 'date'], ['birthDate', 'Date of birth', 'date'], ['username', 'Username', 'text'], ['email', 'Email address', 'email'], ['mobile', 'Mobile number', 'text']];
  return <Layout><div className="narrow-page"><Panel title="Create your 12306 account"><form noValidate onSubmit={submit} className="form-grid">{fields.map(([key, label, type]) => <label key={key}>{label}{type === 'select' ? <select aria-label={label} value={form[key as keyof typeof form] as string} onChange={(event) => update(key, event.target.value)}><option value="">Please select</option><option>China</option><option>United States</option><option>Vietnam</option><option>United Kingdom</option></select> : <input aria-label={label} type={type} value={form[key as keyof typeof form] as string} onChange={(event) => update(key, event.target.value)} />}</label>)}<fieldset><legend>Gender</legend><label><input type="radio" name="gender" checked={form.gender === 'Male'} onChange={() => update('gender', 'Male')} /> Male</label><label><input type="radio" name="gender" checked={form.gender === 'Female'} onChange={() => update('gender', 'Female')} /> Female</label></fieldset><label>Password<input aria-label="Password" type="password" value={form.password} onChange={(event) => update('password', event.target.value)} /></label><label>Confirm Password<input aria-label="Confirm Password" type="password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} /></label><label className="agreement"><input type="checkbox" checked={form.agreement} onChange={(event) => update('agreement', event.target.checked)} /> I have read and agree to abide by <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link> of 12306.cn.</label><button className="orange-button form-submit" type="submit">Register</button><Feedback message={message} error={isError} /></form></Panel></div></Layout>;
}

export function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', idNumber: '', password: '', confirmPassword: '' });
  const [userId, setUserId] = useState<number>();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => { event.preventDefault(); try { if (step === 1) { const response = await apiClient.post('/auth/forgot/verify', form); setUserId(response.data.userId); setStep(2); setMessage(''); } else { const response = await apiClient.post('/auth/forgot/reset', { userId, password: form.password, confirmPassword: form.confirmPassword }); setMessage(response.data.message); setIsError(false); } } catch (error: any) { setMessage(error.response?.data?.message || 'Unable to reset password.'); setIsError(true); } };
  return <Layout><div className="auth-wrap"><Panel title="Forgot password"><form onSubmit={submit} className="form-stack">{step === 1 ? <><label>Email: <input aria-label="Email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label><label>ID number: <input aria-label="ID number" value={form.idNumber} onChange={(event) => update('idNumber', event.target.value)} /></label></> : <><label>New password: <input aria-label="New password" type="password" value={form.password} onChange={(event) => update('password', event.target.value)} /></label><label>Confirm new password: <input aria-label="Confirm new password" type="password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} /></label></>}<button className="orange-button" type="submit">submit</button><Feedback message={message} error={isError} /></form></Panel></div></Layout>;
}

export function AgreementPage({ privacy = false }: { privacy?: boolean }) {
  return <Layout><article className="agreement-page"><h1>{privacy ? 'Privacy Policy' : 'Terms of Service'}</h1><p>Welcome to the 12306.cn English website. Please read this agreement carefully before using online ticketing services.</p><h2>{privacy ? 'Privacy protection' : 'Service rules'}</h2><p>We protect account information and process ticket transactions according to applicable railway service regulations. Users must provide accurate identity information and keep account credentials secure.</p><p>By continuing to use this service, you accept the policies and terms published by China Railway.</p></article></Layout>;
}
