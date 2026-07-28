import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Admin from './components/Admin';
import LoginModal from './components/LoginModal';
import './App.css';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Synchronize route hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      // Scroll to top on page switches
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  // Simple Router Switcher
  const renderPage = () => {
    if (currentHash === '#/admin') {
      return <Admin />;
    } else {
      return (
        <Home 
          onOpenLogin={() => setIsLoginOpen(true)} 
          onOpenSignup={() => setIsSignupOpen(true)} 
          loggedInUser={loggedInUser}
          onLogout={handleLogout}
        />
      );
    }
  };

  return (
    <>
      {renderPage()}

      {/* Global Interactive Modals */}
      <LoginModal 
        isOpen={isLoginOpen || isSignupOpen} 
        onClose={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(false);
        }} 
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default App;
