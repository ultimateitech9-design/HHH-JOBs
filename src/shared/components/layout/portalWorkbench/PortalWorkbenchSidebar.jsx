import { Link, NavLink } from 'react-router-dom';
import { Home } from 'lucide-react';
import PortalWorkbenchBrand from './PortalWorkbenchBrand';
import PortalWorkbenchSupportCard from './PortalWorkbenchSupportCard';
import PortalWorkbenchUserCard from './PortalWorkbenchUserCard';

const PortalWorkbenchSidebar = ({
  collapsed = false,
  viewport = 'desktop',
  portalLabel,
  navItems = [],
  profilePath,
  support,
  user,
  onCollapseToggle,
  onClose
}) => {
  const isCollapsed = viewport === 'desktop' ? collapsed : false;
  const avatarLetter = String(user?.name || user?.email || 'U').trim().slice(0, 1).toUpperCase();
  const avatarUrl = user?.avatarUrl || user?.avatar_url || '';

  return (
    <div className="flex h-full flex-col">
      <PortalWorkbenchBrand
        collapsed={isCollapsed}
        viewport={viewport}
        onCollapseToggle={onCollapseToggle}
        onClose={onClose}
      />

      {isCollapsed ? null : (
        <div className="px-4 py-3">
          <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
            {portalLabel}
          </span>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-50 to-brand-100 text-brand-800 shadow-sm ring-1 ring-brand-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {Icon ? (
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-150 ${
                        isActive
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-700'
                      }`}
                    >
                      <Icon size={18} />
                    </span>
                  ) : null}
                  {isCollapsed ? null : (
                    <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {isCollapsed || support?.showCard === false ? null : <PortalWorkbenchSupportCard support={support} />}

      <div className="border-t border-slate-200 p-3">
        {user ? (
          <Link to={profilePath} className="mb-3 block">
            <PortalWorkbenchUserCard
              avatarLetter={avatarLetter}
              avatarUrl={avatarUrl}
              collapsed={isCollapsed}
              name={user.name}
              subtitle={portalLabel}
            />
          </Link>
        ) : null}

        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Home className="h-4 w-4 shrink-0" />
          {isCollapsed ? null : <span>Back to Home</span>}
        </Link>
      </div>
    </div>
  );
};

export default PortalWorkbenchSidebar;
