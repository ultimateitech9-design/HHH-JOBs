// import React, { useEffect, useMemo, useState } from 'react';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
// import { FiChevronDown } from 'react-icons/fi';
// import { clearAuthSession, getCurrentUser, getDashboardPathByRole } from '../utils/auth';
// import hhhLogo from '../assets/hhh-job-logo.jpeg';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [user, setUser] = useState(() => getCurrentUser());
//   const navigate = useNavigate();

//   const handleMenuToggler = () => setIsMenuOpen((prev) => !prev);

//   useEffect(() => {
//     const syncUser = () => setUser(getCurrentUser());
//     window.addEventListener('auth-changed', syncUser);
//     window.addEventListener('storage', syncUser);
//     return () => {
//       window.removeEventListener('auth-changed', syncUser);
//       window.removeEventListener('storage', syncUser);
//     };
//   }, []);

//   const dashboardPath = useMemo(() => (user ? getDashboardPathByRole(user.role) : null), [user]);
//   const canManageJobs = user?.role === 'hr' || user?.role === 'admin';

//   const handleLogout = () => {
//     clearAuthSession();
//     setIsMenuOpen(false);
//     navigate('/login', { replace: true });
//   };

//   const primaryLinks = [
//     { href: '/#jobs', title: 'Jobs' },
//     { href: '/#companies', title: 'Companies' },
//     { href: '/#services', title: 'Services' }
//   ];

//   return (
//     <header className='fixed top-0 left-0 w-full z-50 app-fixed-header'>
//       <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
//         <nav className='navbar-naukri'>
//           <Link to='/' className='naukri-brand'>
//             <img src={hhhLogo} alt='HHH Job Logo' className='naukri-brand-logo' />
//             <span>HHH Job</span>
//           </Link>

//           <ul className='hidden md:flex naukri-nav-links'>
//             {primaryLinks.map((item) => (
//               <li key={item.title}>
//                 <a href={item.href}>{item.title}</a>
//               </li>
//             ))}
//             <li>
//               <NavLink to='/about'>About</NavLink>
//             </li>
//             {canManageJobs && (
//               <li>
//                 <NavLink to='/post-job'>Post Job</NavLink>
//               </li>
//             )}
//             {dashboardPath && (
//               <li>
//                 <NavLink to={dashboardPath}>Dashboard</NavLink>
//               </li>
//             )}
//           </ul>

//           <div className='hidden xl:flex items-center gap-3'>
//             {user ? (
//               <>
//                 <span className='cinematic-chip capitalize'>{user.role}</span>
//                 {canManageJobs && <NavLink to='/my-job' className='naukri-nav-text-btn'>Manage Jobs</NavLink>}
//                 <button onClick={handleLogout} className='naukri-register-btn'>Logout</button>
//               </>
//             ) : (
//               <>
//                 <Link to='/login' className='naukri-login-btn'>Login</Link>
//                 <Link to='/sign-up' className='naukri-register-btn'>Register</Link>
//                 <span className='naukri-employer-link'>
//                   For employers
//                   {' '}
//                   <FiChevronDown />
//                 </span>
//               </>
//             )}
//           </div>

//           <div className='md:hidden block'>
//             <button onClick={handleMenuToggler}>
//               {isMenuOpen ? <FaXmark className='w-5 h-5 text-primary' /> : <FaBarsStaggered className='w-5 h-5 text-primary' />}
//             </button>
//           </div>
//         </nav>

//         <div className={`mobile-naukri-menu ${isMenuOpen ? '' : 'hidden'}`}>
//           <ul>
//             {primaryLinks.map((item) => (
//               <li key={item.title}>
//                 <a href={item.href} onClick={() => setIsMenuOpen(false)}>{item.title}</a>
//               </li>
//             ))}
//             <li>
//               <NavLink to='/about' onClick={() => setIsMenuOpen(false)}>About</NavLink>
//             </li>
//             {canManageJobs && (
//               <li>
//                 <NavLink to='/post-job' onClick={() => setIsMenuOpen(false)}>Post Job</NavLink>
//               </li>
//             )}
//             {dashboardPath && (
//               <li>
//                 <NavLink to={dashboardPath} onClick={() => setIsMenuOpen(false)}>Dashboard</NavLink>
//               </li>
//             )}
//             {canManageJobs && (
//               <li>
//                 <NavLink to='/my-job' onClick={() => setIsMenuOpen(false)}>Manage Jobs</NavLink>
//               </li>
//             )}
//             {user ? (
//               <li>
//                 <button onClick={handleLogout}>Logout</button>
//               </li>
//             ) : (
//               <>
//                 <li>
//                   <NavLink to='/login' onClick={() => setIsMenuOpen(false)}>Login</NavLink>
//                 </li>
//                 <li>
//                   <NavLink to='/sign-up' onClick={() => setIsMenuOpen(false)}>Register</NavLink>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBarsStaggered, FaXmark } from 'react-icons/fa6';
import { FiChevronDown } from 'react-icons/fi';
import {
  clearAuthSession,
  getCurrentUser,
  getDashboardPathByRole
} from '../utils/auth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());
  const navigate = useNavigate();

  const handleMenuToggler = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    window.addEventListener('auth-changed', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('auth-changed', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const dashboardPath = useMemo(
    () => (user ? getDashboardPathByRole(user.role) : null),
    [user]
  );

  const canManageJobs = user?.role === 'hr' || user?.role === 'admin';
  const jobsNavPath = '/portal/student/jobs';

  const handleLogout = () => {
    clearAuthSession();
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const primaryLinks = [
    { href: '/', title: 'Home' },
    { href: jobsNavPath, title: 'Jobs' },
    { href: '/ats', title: 'ATS' },
    { href: '/#companies', title: 'Companies' },
    { href: '/services', title: 'Services' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      
      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-3 sm:px-6 lg:px-12">

        <nav className="flex h-14 items-center justify-between sm:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img
              src="/hhh-job-logo.png"
              alt="HHH Job Logo"
              className="h-9 w-9 rounded object-contain sm:h-10 sm:w-10"
            />
            <span className="truncate text-base font-bold sm:text-lg">HHH Jobs</span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-5 font-medium text-sm xl:text-base">
            {primaryLinks.map((item) => (
              <li key={item.title}>
                <a href={item.href} className="hover:text-orange-500 transition">
                  {item.title}
                </a>
              </li>
            ))}

            <li>
              <NavLink to="/about" className="hover:text-orange-500">
                About
              </NavLink>
            </li>

            {canManageJobs && (
              <li>
                <NavLink to="/post-job" className="hover:text-orange-500">
                  Post Job
                </NavLink>
              </li>
            )}

            {dashboardPath && (
              <li>
                <NavLink to={dashboardPath} className="hover:text-orange-500">
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {user ? (
              <>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm capitalize">
                  {user.role}
                </span>

                {canManageJobs && (
                  <NavLink
                    to="/my-job"
                    className="text-sm hover:text-orange-500"
                  >
                    Manage Jobs
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-orange-500 px-3 py-2 text-sm text-white transition hover:bg-orange-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm hover:text-orange-500"
                >
                  Login
                </Link>

                <Link
                  to="/sign-up"
                  className="rounded-lg bg-orange-500 px-3 py-2 text-sm text-white transition hover:bg-orange-600"
                >
                  Register
                </Link>

                <span className="flex items-center gap-1 text-sm cursor-pointer">
                  For employers <FiChevronDown />
                </span>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={handleMenuToggler} className="rounded-md p-1 text-slate-700">
              {isMenuOpen ? (
                <FaXmark className="w-6 h-6" />
              ) : (
                <FaBarsStaggered className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <ul className="flex flex-col gap-4">
              {primaryLinks.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    {item.title}
                  </a>
                </li>
              ))}

              <li>
                <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </NavLink>
              </li>

              {canManageJobs && (
                <li>
                  <NavLink to="/post-job" onClick={() => setIsMenuOpen(false)}>
                    Post Job
                  </NavLink>
                </li>
              )}

              {dashboardPath && (
                <li>
                  <NavLink to={dashboardPath} onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </NavLink>
                </li>
              )}

              {canManageJobs && (
                <li>
                  <NavLink to="/my-job" onClick={() => setIsMenuOpen(false)}>
                    Manage Jobs
                  </NavLink>
                </li>
              )}

              {user ? (
                <li>
                  <button onClick={handleLogout} className="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white">
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                      Register
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;
