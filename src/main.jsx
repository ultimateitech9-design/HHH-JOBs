import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './index.css';
import './styles/globals.css';
import './styles/animations.css';
import router from './app/router';
import { installChunkLoadRecovery } from './shared/utils/chunkLoadRecovery';

installChunkLoadRecovery();

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <RouterProvider router={router} />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: 'Manrope, sans-serif',
          fontSize: '14px',
          borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(14,35,69,0.14)',
        },
        success: {
          iconTheme: { primary: '#1f8f53', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#b8393e', secondary: '#fff' },
        },
      }}
    />
  </HelmetProvider>
);
