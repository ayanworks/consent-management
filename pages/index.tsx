import { useState, FormEvent } from 'react';
import { supabase } from '../client';
import React from 'react';

export default function SignIn() {
  const [email, setEmail] = useState<string>(''); // State for email
  const [password, setPassword] = useState<string>(''); // State for password
  const [error, setError] = useState<string | null>(null); // Error message
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message
  const [isSending, setIsSending] = useState<boolean>(false); // Sending state

  // Sign in function with event type FormEvent
  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSending(true);

    const { error } = await supabase.auth.signIn({
      email, 
      password,
    });

    setIsSending(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('You have successfully signed in!');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
      <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
        <div className="p-4 py-6 text-white bg-white-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
          <img 
            src="https://www.bridge-global.com/blog/wp-content/uploads/2022/07/consent-management-platform-How-can-businesses-get-started-with-consent-management.jpg" // Update with your image path
            alt="Logo" 
            className="w-[15rem] h-[15rem] max-w-xs mx-auto mb-0 rounded-full" 
          />
          <div className="my-3 text-3xl text-gray-800 font-bold tracking-wider text-center">
            <a href="#">CONSENT POLICY</a>
          </div>
          {/* <p className="mt-5 font-small text-sm/[15px] text-center text-gray-800 md:mt-0">
            Employee Portal For To Get Credential <br></br>In Their Wallet
          </p> */}
        </div>
        <div className="p-5 bg-white md:flex-1">
          <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Login</h3>
          <form action="#" className="flex flex-col space-y-5" onSubmit={signIn}>
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" 
                required 
                disabled={isSending} 
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" 
                required 
                disabled={isSending} 
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>} 
            {/* {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>} */}
            <div>
              <button 
                type="submit" 
                disabled={!email || !password || isSending} 
                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-gray-800 rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-orange-200 focus:ring-4">
                {isSending ? (
                  <div className="flex justify-center items-center">
                    <span className="mr-2">LOGGING IN...</span>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
