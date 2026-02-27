import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FiChevronDown,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMenu,
  FiTwitter,
  FiX
} from 'react-icons/fi';
import { FaYoutube } from 'react-icons/fa';
import { clearAuthSession, getCurrentUser, getDashboardPathByRole, getToken, setAuthSession } from '../utils/auth';
import { apiFetch } from '../utils/api';
import { FOOTER_LINK_COLUMNS } from '../modules/common/pages/footerPages';
import AiChatbot from '../components/AiChatbot';

const AppShell = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEmployerMenuOpen, setIsEmployerMenuOpen] = useState(false);
  const employerMenuDesktopRef = useRef(null);
  const employerMenuMobileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    window.addEventListener('auth-changed', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('auth-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const refreshHeaderUser = async () => {
      if (!user) return;

      try {
        const response = await apiFetch('/auth/me');
        if (!response.ok) return;
        const payload = await response.json();
        const latestUser = payload?.user;
        if (!latestUser || !mounted) return;

        const currentAvatar = user.avatarUrl || user.avatar_url || '';
        const latestAvatar = latestUser.avatarUrl || latestUser.avatar_url || '';
        const currentName = String(user.name || '');
        const latestName = String(latestUser.name || '');

        if (currentAvatar === latestAvatar && currentName === latestName) return;

        const mergedUser = { ...user, ...latestUser };
        setUser(mergedUser);
        const token = getToken();
        if (token) setAuthSession(token, mergedUser);
      } catch (error) {
        // Ignore silent refresh errors in header.
      }
    };

    refreshHeaderUser();

    return () => {
      mounted = false;
    };
  }, [location.pathname, user]);

  const jobsNavPath = !user
    ? '/login'
    : (user.role === 'hr' || user.role === 'admin')
      ? '/portal/hr/jobs'
      : '/portal/student/jobs';

  const availableLinks = [
    { to: '/', label: 'Home' },
    { to: jobsNavPath, label: 'Jobs' },
    { to: '/ats', label: 'ATS' },
    { to: '/services', label: 'Services' },
    { to: '/about-us', label: 'About' },
    { to: '/blog', label: 'Blog' }
  ];

  const dashboardPath = user ? getDashboardPathByRole(user.role) : null;
  const isPortalWorkbench = /^\/portal\/(admin|hr|student|platform|audit)\b/i.test(location.pathname);
  const isHomePage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const showAiChatbot = isHomePage || isPortalWorkbench;
  const employerPath = user?.role === 'admin' ? '/portal/admin/dashboard' : user?.role === 'hr' ? '/portal/hr/dashboard' : '/login';
  const employerMenuItems = [
    {
      label: user ? 'Employer Dashboard' : 'Employer Login',
      to: employerPath,
      hint: user ? 'Open your hiring workspace' : 'Login to continue hiring'
    },
    {
      label: 'Post a Job',
      to: user && (user.role === 'hr' || user.role === 'admin') ? '/portal/hr/jobs' : '/sign-up',
      hint: 'Create and publish job openings'
    },
    {
      label: 'Hiring Solutions',
      to: '/services',
      hint: 'Explore plans and hiring tools'
    },
    {
      label: 'Contact Sales',
      to: '/contact-us',
      hint: 'Talk to our team for custom support'
    },
    {
      label: 'Employer Home',
      to: '/employer-home',
      hint: 'Platform overview for recruiters'
    }
  ];
  const maxFooterRows = Math.max(...FOOTER_LINK_COLUMNS.map((column) => column.links.length));

  useEffect(() => {
    setIsMenuOpen(false);
    setIsEmployerMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isEmployerMenuOpen) return;

    const handlePointerDown = (event) => {
      const clickedInsideDesktop = employerMenuDesktopRef.current?.contains(event.target);
      const clickedInsideMobile = employerMenuMobileRef.current?.contains(event.target);
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setIsEmployerMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isEmployerMenuOpen]);

  const handleLogout = () => {
    clearAuthSession();
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-frame">
      <header className={`site-header ${isPortalWorkbench ? 'site-header--portal' : ''}`}>
        <div className="site-header-inner">
          <Link to="/" className="site-brand">
            <span className="site-brand-mark">
              <img src="/hhh-job-logo.png" alt="HHH Job logo" />
            </span>
            <span>HHH Jobs</span>
          </Link>

          <button type="button" className="site-menu-toggle" onClick={() => setIsMenuOpen((open) => !open)}>
            {isMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>

          <nav className={`site-nav ${isMenuOpen ? 'site-nav--open' : ''}`}>
            {availableLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `site-nav-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}

            <div className="site-nav-mobile-actions">
              {user ? (
                <>
                  {dashboardPath ? (
                    <Link to={dashboardPath} className="site-header-btn site-header-btn--ghost site-header-btn--dashboard" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                  ) : null}
                  <button type="button" className="site-header-btn site-header-btn--ghost" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="site-header-btn site-header-btn--ghost" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/sign-up" className="site-header-btn site-header-btn--solid" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </>
              )}

              <div className={`site-employer-menu site-employer-menu--mobile ${isEmployerMenuOpen ? 'is-open' : ''}`} ref={employerMenuMobileRef}>
                <button
                  type="button"
                  className="site-header-employers"
                  aria-expanded={isEmployerMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsEmployerMenuOpen((open) => !open)}
                >
                  <span>For employers</span>
                  <FiChevronDown size={15} />
                </button>
                <div className="site-employer-dropdown" role="menu" aria-label="Employer options">
                  {employerMenuItems.map((item) => (
                    <Link
                      key={`mobile-${item.label}`}
                      to={item.to}
                      className="site-employer-item"
                      onClick={() => {
                        setIsEmployerMenuOpen(false);
                        setIsMenuOpen(false);
                      }}
                    >
                      <strong>{item.label}</strong>
                      <small>{item.hint}</small>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="site-header-actions">
            {user ? (
              <>
                {dashboardPath ? (
                  <Link to={dashboardPath} className="site-header-btn site-header-btn--ghost site-header-btn--dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                ) : null}
                <button type="button" className="site-header-btn site-header-btn--ghost" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="site-header-btn site-header-btn--ghost">Login</Link>
                <Link to="/sign-up" className="site-header-btn site-header-btn--solid">Register</Link>
              </>
            )}

            <div className={`site-employer-menu ${isEmployerMenuOpen ? 'is-open' : ''}`} ref={employerMenuDesktopRef}>
              <button
                type="button"
                className="site-header-employers"
                aria-expanded={isEmployerMenuOpen}
                aria-haspopup="menu"
                onClick={() => setIsEmployerMenuOpen((open) => !open)}
              >
                <span>For employers</span>
                <FiChevronDown size={15} />
              </button>
              <div className="site-employer-dropdown" role="menu" aria-label="Employer options">
                {employerMenuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="site-employer-item"
                    onClick={() => setIsEmployerMenuOpen(false)}
                  >
                    <strong>{item.label}</strong>
                    <small>{item.hint}</small>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={`main-shell ${isPortalWorkbench ? 'main-shell--portal' : ''} ${isHomePage ? 'main-shell--home' : ''} ${isLoginPage ? 'main-shell--login' : ''}`}>
        <Outlet />
      </main>

      {!isPortalWorkbench ? (
        <footer className="site-footer">
          <div className="site-footer-inner">
            <section className="site-footer-brand">
              <Link to="/" className="site-brand site-brand--footer">
                <span className="site-brand-mark">
                  <img src="/hhh-job-logo.png" alt="HHH Job logo" />
                </span>
                <span>HHH Jobs</span>
              </Link>
              <p>Connect with us</p>
              <div className="site-social-row">
                <a href="https://www.facebook.com/hhhjobs/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FiFacebook size={16} /></a>
                <a href="https://www.instagram.com/hhhjobs1/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram size={16} /></a>
                <a href="/" aria-label="X"><FiTwitter size={16} /></a>
                <a href="https://www.youtube.com/@HHHJobs" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube size={16} /></a>
                <a href="https://www.linkedin.com/company/hhh-jobs/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin size={16} /></a>
              </div>
            </section>

            <section className="site-footer-links">
              {Array.from({ length: maxFooterRows }).map((_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="site-footer-link-row">
                  {FOOTER_LINK_COLUMNS.map((column, columnIndex) => {
                    const item = column.links[rowIndex];
                    return item ? (
                      <Link key={item.key} to={item.to} className="site-footer-link-cell">
                        {item.label}
                      </Link>
                    ) : (
                      <span key={`empty-${columnIndex}-${rowIndex}`} className="site-footer-link-cell site-footer-link-cell--empty" aria-hidden="true">
                        &nbsp;
                      </span>
                    );
                  })}
                </div>
              ))}
            </section>

            <section className="site-footer-app site-footer-app--side">
              <h4>Apply on the go</h4>
              <p>Get real-time job updates on our App</p>
              <div className="site-store-row">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-store-btn site-store-btn--play"
                >
                  Google Play
                </a>
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-store-btn site-store-btn--app"
                >
                  App Store
                </a>
              </div>
            </section>
          </div>

          <section className="site-footer-contact-band">
            <div className="site-footer-contact-grid">
              <div className="site-footer-contact-item">
                <FiMail size={21} />
                <div>
                  <p>HR</p>
                  <a href="mailto:hr@hhh-jobs.com">hr@hhh-jobs.com</a>
                </div>
              </div>
              <div className="site-footer-contact-item">
                <FiMail size={21} />
                <div>
                  <p>Support</p>
                  <a href="mailto:support@hhh-jobs.com">support@hhh-jobs.com</a>
                </div>
              </div>
              <div className="site-footer-contact-item">
                <FiMail size={21} />
                <div>
                  <p>Sales</p>
                  <a href="mailto:sales@hhh-jobs.com">sales@hhh-jobs.com</a>
                </div>
              </div>
            </div>
          </section>

          <div className="site-footer-legal">
            <p>© 2026 HHH Job. All rights reserved.</p>
            <div className="site-footer-legal-links">
              <Link to="/terms-and-conditions">Terms of Use</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/sitemap">Link to us</Link>
            </div>
          </div>
        </footer>
      ) : null}

      <AiChatbot hideToggleButton={!showAiChatbot} />
    </div>
  );
};

export default AppShell;
