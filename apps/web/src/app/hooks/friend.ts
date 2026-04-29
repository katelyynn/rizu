'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/auth_context';

export type friendStatus = 'unavailable' | 'none' | 'incoming' | 'outgoing' | 'friends';

export function useFriendStatus(slug: string) {
  const { user } = useAuth();
  const [ status, setStatus ] = useState<friendStatus>('none');
  const [ loading, setLoading ] = useState(false);
  const [ requestId, setRequestId ] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setStatus('unavailable');
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/status/${slug}`, {
          credentials: 'include'
        });

        const data = await res.json();
        setStatus(data.status);
        setRequestId(data.id);
      } catch {
        setStatus('unavailable');
      }
    };

    fetchStatus();
  }, [ user, slug ]);

  const handleAction = async () => {
    setLoading(true);

    try {
      let res: Response;

      switch (status) {
        case 'none':
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/${slug}`, {
            method: 'POST',
            credentials: 'include'
          });

          const data = await res.json();

          if (res.ok) {
            setStatus('outgoing');
            setRequestId(data.id);
          }

          break;
        case 'outgoing':
          if (!requestId) break;

          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/revoke/${requestId}`, {
            method: 'POST',
            credentials: 'include'
          });

          if (res.ok) {
            setStatus('none');
          }

          break;
        case 'incoming':
          if (!requestId) break;

          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/accept/${requestId}`, {
            method: 'POST',
            credentials: 'include'
          });

          if (res.ok) {
            setStatus('friends');
          }

          break;
        case 'friends':
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/remove/${slug}`, {
            method: 'POST',
            credentials: 'include'
          });

          if (res.ok) {
            setStatus('none');
          }

          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  let buttonText = 'Add Friend';
  switch (status) {
    case 'outgoing': buttonText = 'Sent Request'; break;
    case 'incoming': buttonText = 'Accept Friend'; break;
    case 'friends': buttonText = 'Friends'; break;
    default: break;
  }

  const isActionable = status != 'unavailable';

  return {
    status,
    loading,
    handleAction,
    buttonText,
    isActionable
  };
}