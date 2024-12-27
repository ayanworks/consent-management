// import '../styles/globals.css';
// import { useState, useEffect } from 'react';
// import { supabase } from '../client';
// import { useRouter } from 'next/router';

// function MyApp({ Component, pageProps }) {
//   const router = useRouter();
//   const [authenticatedState, setAuthenticatedState] = useState('not-authenticated');

//   useEffect(() => {
//     // Subscribe to auth state changes
//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === 'SIGNED_IN') {
//         setAuthenticatedState('authenticated');
//         if (router.pathname === '/') {
//           // Redirect only if user is on the home page
//           router.push('/profile');
//         }
//       } else if (event === 'SIGNED_OUT') {
//         setAuthenticatedState('not-authenticated');
//         if (router.pathname !== '/') {
//           // Redirect to home page if not authenticated and not already on it
//           router.push('/');
//         }
//       }
//     });

//     // Check user authentication on load
//     checkUser();

//     return () => authListener?.unsubscribe();
//   }, []);

//   // Function to check the current user
//   async function checkUser() {
//     const user = await supabase.auth.user();
//     if (user) {
//       setAuthenticatedState('authenticated');
//     } else {
//       setAuthenticatedState('not-authenticated');
//     }
//   }

//   return <Component {...pageProps} />;
// }

// export default MyApp;



import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authenticatedState, setAuthenticatedState] = useState('not-authenticated');

  useEffect(() => {
    // Check user authentication on load
    const checkUser = async () => {
      const user = await supabase.auth.user();

      // If no user is found, redirect to the login page
      if (!user && router.pathname !== '/') {
        router.push('/');
      } else {
        setAuthenticatedState('authenticated');
      }
    };

    // Check authentication on every page load
    checkUser();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setAuthenticatedState('authenticated');
        if (router.pathname === '/') {
          // Redirect only if user is on the home page
          router.push('/profile');
        }
      } else if (event === 'SIGNED_OUT') {
        setAuthenticatedState('not-authenticated');
        if (router.pathname !== '/') {
          // Redirect to home page if not authenticated and not already on it
          router.push('/');
        }
      }
    });

    return () => authListener?.unsubscribe();
  }, [router]);

  return <Component {...pageProps} />;
}

export default MyApp;
