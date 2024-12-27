import React, { useState, FormEvent } from 'react';
import { supabase } from '../client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <Card className="max-w-lg w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-gray-800 text-3xl">
            CONSENT POLICY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={signIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSending}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
            <Button type="submit" disabled={!email || !password || isSending} className="w-full">
              {isSending ? (
                <div className="flex justify-center items-center">
                  <span className="mr-2">LOGGING IN...</span>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
