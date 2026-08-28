import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SearchBox from '../components/SearchBox';

function HomePage() {
  const banners = [['/assets/banner1.jpg', 'High-speed train at night'], ['/assets/banner2.jpg', 'Railway service banner'], ['/assets/banner3.jpg', 'Passenger rail banner']];
  const [slide, setSlide] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setSlide((current) => (current + 1) % banners.length), 5000); return () => window.clearInterval(timer); }, [banners.length]);
  const guides = [
    ['How to book tickets online?', 'ticketing'], ['How to change or refund tickets?', 'refund'],
    ['How to check train status?', 'misc'], ['How to use 12306 mobile app?', 'misc'],
  ];
  return <Layout><div className="home-hero"><div className="hero-slides">{banners.map(([src, alt], index) => <img className={slide === index ? 'active' : ''} key={src} src={src} alt={alt} aria-hidden={slide !== index} />)}<div className="slide-dots">{banners.map(([, alt], index) => <button type="button" className={slide === index ? 'active' : ''} key={alt} aria-label={`Show banner ${index + 1}`} aria-current={slide === index} onClick={() => setSlide(index)} />)}</div></div><SearchBox /></div><section className="quick-guide"><div className="section-heading"><span>On the line</span><h1>Quick Guide</h1><Link to="/guide?tab=ticketing">More</Link></div><div className="guide-links">{guides.map(([label, tab]) => <Link key={label} to={`/guide?tab=${tab}&q=${encodeURIComponent(label)}`}><b>›</b>{label}</Link>)}</div></section></Layout>;
}

export default HomePage;
