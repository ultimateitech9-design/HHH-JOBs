import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import './styles/globals.css';
import router from './app/router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
