// pages/_app.js
import '../styles/globals.css';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../client';
import { useRouter } from 'next/router';
import React from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authenticatedState, setAuthenticatedState] = useState('not-authenticated');

  // Debounced navigation to avoid excessive routing calls
  const debouncedNavigation = useCallback((path) => {
    const timer = setTimeout(() => {
      router.push(path);
    });

    return () => clearTimeout(timer); // Clean up previous navigation attempts
  }, [router]);

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session);

      if (event === 'SIGNED_IN') {
        setAuthenticatedState('authenticated');
        debouncedNavigation('/profile');
      } else if (event === 'SIGNED_OUT') {
        setAuthenticatedState('not-authenticated');
        debouncedNavigation('/');
      }
    });

    // Check user authentication on load
    checkUser();

    // Clean up the auth listener
    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, [debouncedNavigation]);

  useEffect(() => {
    checkUser();
  })

  // Function to check the current user
  async function checkUser() {
    const user = await supabase.auth.user();
    if (user) {
      setAuthenticatedState('authenticated');
    } else {
      debouncedNavigation('/'); 
    }
  }

  // Function to handle authentication changes
  async function handleAuthChange(event, session) {
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    });
  }

  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

