import { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import RootLayout from '../shared/components/layout/RootLayout';

import publicRoutes from './publicRoutes';
import studentRoutes from './studentRoutes';
import hrRoutes from './hrRoutes';
import adminRoutes from './adminRoutes';
import superAdminRoutes from './superAdminRoutes';
import dataentryRoutes from './dataentryRoutes';
import accountsRoutes from './accountsRoutes';
import salesRoutes from './salesRoutes';
import supportRoutes from './supportRoutes';
import platformRoutes from './platformRoutes';
import auditRoutes from './auditRoutes';
import retiredRoutes from './retiredRoutes';

const ManagementPortalPage = lazy(() => import('../modules/common/pages/ManagementPortalPage'));

const SuspenseWrapper = ({ children }) => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-500 border-t-transparent" />
      </div>
    }
  >
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/management',
    element: (
      <SuspenseWrapper>
        <ManagementPortalPage />
      </SuspenseWrapper>
    )
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      ...adminRoutes,
      ...hrRoutes,
      ...studentRoutes,
      ...retiredRoutes,
      ...dataentryRoutes,
      ...accountsRoutes,
      ...salesRoutes,
      ...supportRoutes,
      ...superAdminRoutes,
      ...platformRoutes,
      ...auditRoutes,
      ...publicRoutes
    ].map((route) => wrapRouteSuspense(route))
  }
]);

function wrapRouteSuspense(route) {
  if (!route) return route;

  const wrapped = { ...route };

  if (wrapped.element && !isNavigateElement(wrapped.element)) {
    wrapped.element = <SuspenseWrapper>{wrapped.element}</SuspenseWrapper>;
  }

  if (wrapped.children) {
    wrapped.children = wrapped.children.map((child) => wrapRouteSuspense(child));
  }

  return wrapped;
}

function isNavigateElement(element) {
  if (!element) return false;
  return element.type === Navigate;
}

export default router;
