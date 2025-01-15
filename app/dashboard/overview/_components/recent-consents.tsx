import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/client'; 
import { formatDistanceToNow } from 'date-fns'; // Using date-fns for time formatting

interface Consent {
  consent_id: string;
  created_at: string;
  consent_status: string;
  User: {
    name: string;
    email: string;
    avatar_url: string;
  };
}

export function RecentConsents() {
  const [consents, setConsents] = useState<Consent[]>([]);

  // Fetch recent consents from Supabase
  useEffect(() => {
    async function fetchConsents() {
      const { data, error } = await supabase
        .from('Consent_Record')
        .select('consent_id, consent_status, created_at, User(name, email)') 
        .order('created_at', { ascending: false }) 
        .limit(5);

      if (error) {
        console.error('Error fetching consents:', error);
      } else {
        setConsents(data);
      }
    }

    fetchConsents();
  }, []);

  return (
    <div className="space-y-8">
      {consents.map((consent) => (
        <div key={consent.consent_id} className="flex items-center">
          {/* Avatar can be added back if needed */}
          <Avatar className="h-9 w-9">
            {consent.User.avatar_url ? (
              <AvatarImage src={consent.User.avatar_url} alt="Avatar" />
            ) : (
              <AvatarFallback>{consent.User.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{consent.User.name}</p>
            <p className="text-sm text-muted-foreground">{consent.User.email}</p>
            {/* Display formatted created_at */}
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(consent.created_at))} ago
            </p>
          </div>
          <div className="ml-auto font-medium">
            {consent.consent_status === 'Opt-in' ? 'Opt-in' : 'Opt-out'}
          </div>
        </div>
      ))}
    </div>
  );
}
