import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../utils/auth';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <button onClick={handleLogout} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
      Logout
    </button>
  );
};

export default LogoutButton;
