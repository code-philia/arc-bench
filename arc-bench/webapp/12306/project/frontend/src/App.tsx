import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { LoginPage, RegisterPage, ForgotPasswordPage, AgreementPage } from './pages/AuthPages';
import SearchPage from './pages/SearchPage';
import { BookingPage, ConfirmPage, PaymentPage } from './pages/BookingPages';
import CenterPage from './pages/CenterPage';
import GuidePage from './pages/GuidePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/terms" element={<AgreementPage />} />
      <Route path="/privacy" element={<AgreementPage privacy />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/booking/confirm" element={<ConfirmPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/center/*" element={<CenterPage />} />
      <Route path="/guide" element={<GuidePage />} />
    </Routes>
  );
}

export default App;
