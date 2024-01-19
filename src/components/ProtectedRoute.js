import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
    }
  }, [user]);
  return (
    <div className='layout p-1'>
      <header className='header bg-white p-2 flex justify-between items-center'>
        <h2
          className='uppercase cursor-pointer'
          onClick={() => navigate('/')}
        >
          <span className='text-secondary'>Med</span>
          <span className='text-primary'>Connect</span>
        </h2>
        {user && (
          <div className='login uppercase flex items-center gap-3 '>
            <div
              className='acc flex items-center gap-small cursor-pointer'
              onClick={() => navigate('/profile')}
            >
              <i className='ri-shield-user-line'></i>
              <h4 className='underline bold'>{user.name}</h4>
            </div>

            <i
              className='ri-logout-box-r-line cursor-pointer'
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
            ></i>
          </div>
        )}
      </header>
      <main className='content my-1 bg-white'>{children}</main>
    </div>
  );
}

export default ProtectedRoute;
