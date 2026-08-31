import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Home from './components/Home';
import { supabase } from './lib/supabase';
import './App.css';

// Lazy-loaded components for optimal bundle splitting
const Admin = lazy(() => import('./components/Admin'));
const Signup = lazy(() => import('./components/Signup'));
const LoginModal = lazy(() => import('./components/LoginModal'));

const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: '#D84315',
    fontSize: '14px',
    fontWeight: '600',
    gap: '8px'
  }}>
    <span style={{
      width: '20px',
      height: '20px',
      border: '2px solid #D84315',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.8s linear infinite'
    }}></span>
    <span>페이지 불러오는 중...</span>
  </div>
);

function App() {
  const [currentRoute, setCurrentRoute] = useState({
    hash: window.location.hash,
    pathname: window.location.pathname
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Synchronize route (hash and pathname) changes
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentRoute({
        hash: window.location.hash,
        pathname: window.location.pathname
      });
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Helper to extract clean user info from Supabase user session
  const formatUserObject = useCallback((user) => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0],
      phone: user.user_metadata?.phone || '',
    };
  }, []);

  // Supabase Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedInUser(formatUserObject(session?.user));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [formatUserObject]);

  const handleLoginSuccess = useCallback((user) => {
    setLoggedInUser(user);
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setLoggedInUser(null);
  }, []);

  // Router Switcher for /admin and /signup (supporting both pathname and hash)
  const renderPage = () => {
    const isAdmin = currentRoute.hash === '#/admin' || currentRoute.pathname === '/admin' || currentRoute.pathname === '/admin/';
    const isSignup = currentRoute.hash === '#/signup' || currentRoute.pathname === '/signup' || currentRoute.pathname === '/signup/';

    if (isAdmin) {
      return (
        <Suspense fallback={<PageLoader />}>
          <Admin />
        </Suspense>
      );
    } else if (isSignup) {
      return (
        <Suspense fallback={<PageLoader />}>
          <Signup 
            onOpenLogin={() => setIsLoginOpen(true)}
            onSignupSuccess={(user) => {
              setLoggedInUser(user);
            }}
            onNavigateHome={() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/';
              } else {
                window.location.hash = '#/';
              }
            }}
          />
        </Suspense>
      );
    } else {
      return (
        <Home 
          onOpenLogin={() => setIsLoginOpen(true)} 
          onOpenSignup={() => {
            window.location.hash = '#/signup';
          }} 
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
      {(isLoginOpen || isSignupOpen) && (
        <Suspense fallback={null}>
          <LoginModal 
            isOpen={isLoginOpen || isSignupOpen} 
            onClose={() => {
              setIsLoginOpen(false);
              setIsSignupOpen(false);
            }} 
            onLoginSuccess={handleLoginSuccess}
          />
        </Suspense>
      )}
    </>
  );
}

export default App;
