import { type ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, setUser as persistUser } from '../api';

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => getUser());
  const [notice, setNotice] = useState('');
  const goDefaultSearch = () => navigate('/search?from=Beijing&to=Shanghai');

  const signOut = () => {
    persistUser(null);
    setUser(null);
    setNotice('Logout successful.');
    navigate('/');
  };

  useEffect(() => {
    const stored = sessionStorage.getItem('global-notice');
    if (stored) {
      setNotice(stored);
      sessionStorage.removeItem('global-notice');
    }
  }, [location.pathname]);

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link to="/" className="brand"><img src="/assets/logo.png" alt="12306 China Railway" /></Link>
        <div className="top-actions">
          {user ? (
            <>
              <Link to="/center" className="user-name">{user.name || user.username}</Link>
              <button className="text-button" onClick={signOut}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          <AccountMenu loggedIn={Boolean(user)} />
          <span className="language">Simplified Chinese ▾</span>
          <span className="contact">Contact us</span>
        </div>
      </header>
      <nav className="main-nav">
        <div className="nav-inner">
          <Link to="/">Home</Link>
          <div className="nav-menu">
            <button className="nav-link" onClick={goDefaultSearch}>Booking ▾</button>
            <div className="dropdown">
              <button onClick={goDefaultSearch}>Tickets</button>
              <button onClick={() => navigate(user ? '/center/orders?tab=upcoming' : '/login')}>Refund</button>
              <button onClick={() => navigate(user ? '/center/orders?tab=upcoming' : '/login')}>Upcoming trips</button>
            </div>
          </div>
          <div className="nav-menu">
            <Link className="nav-link" to="/guide">Travel guides ▾</Link>
            <GuideDropdown />
          </div>
        </div>
      </nav>
      <div className="page-content">{children}</div>
      {notice && <div role="alert" className="global-notice">{notice}</div>}
      <footer>
        <div>COPYRIGHT(c)2008-2025 CHINA ACADEMY OF RAILWAY SCIENCES CORPORATION LIMITED, ALL RIGHTS RESERVED</div>
        <div>Beijing public network security record 11010802038392 | ICP 05020493-4</div>
        <div><Link to="/privacy">Privacy Policy</Link> | Cookie Statement</div>
      </footer>
    </div>
  );
}

function AccountMenu({ loggedIn }: { loggedIn: boolean }) {
  const target = (path: string) => loggedIn ? path : '/login';
  return (
    <div className="nav-menu">
      <Link className="text-button" to={target('/center')}>My 12306 ▾</Link>
      <div className="dropdown account-dropdown">
        <Link to={target('/center/orders')}>Order center</Link>
        <Link to={target('/center/profile')}>User information</Link>
        <Link to={target('/center/security')}>Account security</Link>
        <Link to={target('/center/passengers')}>My passengers</Link>
      </div>
    </div>
  );
}

function GuideDropdown() {
  const groups = [
    { title: 'Ticketing', key: 'ticketing', links: ['How to book tickets online?', 'What ID documents are accepted?', 'How many kinds of tickets are there?', 'Where can I buy the ticket?'] },
    { title: 'Endorsement and refund', key: 'refund', links: ['How to change or refund tickets?', 'What is endorsement?', 'What are the rules of ticket endorsement?', 'How is a refund calculated?'] },
    { title: 'Miscellaneous', key: 'misc', links: ['How to check train status?', 'How to use 12306 mobile app?', 'How can I contact support?', 'What documents are accepted?'] },
  ];
  return (
    <div className="dropdown guide-dropdown">
      {groups.map((group) => (
        <section key={group.key}>
          <strong>{group.title}</strong>
          {group.links.map((link) => <Link key={link} to={`/guide?tab=${group.key}&q=${encodeURIComponent(link)}`}>{link}</Link>)}
          <Link to={`/guide?tab=${group.key}`}>More</Link>
        </section>
      ))}
    </div>
  );
}

export function Panel({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{title && <h2 className="panel-title">{title}</h2>}{children}</section>;
}

export function Feedback({ message, error = false }: { message: string; error?: boolean }) {
  return message ? <div role="alert" className={`feedback ${error ? 'error' : 'success'}`}>{message}</div> : null;
}

export function EmptyState({ text, linkText = 'Search tickets', entryText }: { text: string; linkText?: string; entryText?: string }) {
  return <div className="empty-state">{entryText && <Link className="empty-entry" to="/search?from=Beijing&to=Shanghai">{entryText}</Link>}<img src="/assets/empty.png" alt="" /><p>{text}</p><Link to="/search?from=Beijing&to=Shanghai">{linkText}</Link></div>;
}
