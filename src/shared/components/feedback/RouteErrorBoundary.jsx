import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Link, useLocation, useRouteError } from 'react-router-dom';

import { attemptChunkRecovery, isRecoverableChunkError } from '../../utils/chunkLoadRecovery';

const shellStyle = {
  background:
    'radial-gradient(circle at top left, rgba(229,155,23,0.16), transparent 26%), radial-gradient(circle at 84% 10%, rgba(17,33,59,0.12), transparent 22%), linear-gradient(180deg, #fbf8f2 0%, #f4f7fb 100%)'
};

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const location = useLocation();
  const isChunkError = isRecoverableChunkError(error);

  useEffect(() => {
    if (typeof window === 'undefined' || !isChunkError) return;

    attemptChunkRecovery({
      error,
      pathname: location.pathname,
      storage: window.sessionStorage,
      reload: () => window.location.reload()
    });
  }, [error, isChunkError, location.pathname]);

  const message = isChunkError
    ? 'This page was updated recently, so your browser may still be using an older file. Reload once to fetch the latest version.'
    : 'Something went wrong while loading this page. Please refresh and try again.';

  return (
    <div className="min-h-screen px-6 py-12 text-slate-900" style={shellStyle}>
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-[32px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Page Recovery
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {isChunkError ? 'A fresh reload is needed for this page' : 'This page could not be loaded'}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">{message}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
