import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';

const PortalWorkbenchLayout = ({ portalKey, portalLabel, subtitle, navItems = [], support }) => {
  const location = useLocation();
  const [user, setUser] = useState(() => getCurrentUser());
  const activeItem = navItems.find((item) => location.pathname.startsWith(item.to)) || navItems[0];
  const profilePath = user?.role === 'hr'
    ? '/portal/hr/profile'
    : user?.role === 'student'
      ? '/portal/student/profile'
      : navItems[0]?.to || '/';
  const sidebarAvatarUrl = user?.avatarUrl || user?.avatar_url || '';
  const sidebarHeadline = String(
    user?.headline
    || user?.targetRole
    || user?.designation
    || user?.role
    || ''
  ).trim();

  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    window.addEventListener('auth-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('auth-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return (
    <div className={`portal-workbench portal-workbench--${portalKey}`}>
      <aside className="portal-sidebar">
        <p className="portal-sidebar-title">{portalLabel}</p>

        <nav className="portal-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'portal-nav-link is-active' : 'portal-nav-link')}
              >
                {Icon ? <Icon size={16} /> : null}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="portal-support">
          <h4>{support?.title || 'Need support?'}</h4>
          <p>{support?.text || 'Use module shortcuts to stay on top of daily activity.'}</p>
          <Link to={support?.to || '/'}>{support?.cta || 'Open guide'}</Link>
        </div>

        {user ? (
          <div className="portal-sidebar-account">
            <Link to={profilePath} className="portal-sidebar-profile">
              <span className="portal-sidebar-profile__avatar" aria-hidden="true">
                {sidebarAvatarUrl ? (
                  <img src={sidebarAvatarUrl} alt={`${user.name || 'User'} avatar`} />
                ) : (
                  <span>{String(user.name || user.email || 'U').trim().slice(0, 1).toUpperCase()}</span>
                )}
              </span>
              <span className="portal-sidebar-profile__copy">
                <strong>{user.name || 'Profile'}</strong>
                <small>{sidebarHeadline || 'Update headline in profile'}</small>
              </span>
            </Link>
          </div>
        ) : null}
      </aside>

      <section className="portal-main">
        <div className="portal-canvas">
          <div className="portal-canvas-head">
            <p>{portalLabel}</p>
            <h1>{activeItem?.label || 'Dashboard'}</h1>
            <span>{subtitle}</span>
          </div>

          <div className="portal-content">
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortalWorkbenchLayout;
