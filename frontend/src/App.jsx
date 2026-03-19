import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import AppRoutes from './AppRoutes';

// Global Styles
import './index.css';
import { useEffect } from 'react';
import { getMe } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
  dispatch(getMe()); // ← app load pe call hota hai?
}, [dispatch]);
  return (
      <Router>
        <div className="min-h-screen bg-[#0A0A0F] font-sans selection:bg-[#7C3AED]/30">
          <AppRoutes />
          
          {/* Global Components like Toast notifications can go here */}
        </div>
      </Router>
  );
}

export default App;