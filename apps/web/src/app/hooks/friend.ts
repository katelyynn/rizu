'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/auth_context';

export type friendStatus = 'unavailable' | 'none' | 'incoming' | 'outgoing' | 'friends';

export function useFriendStatus(slug: string) {
  const { user } = useAuth();
  const [ status, setStatus ] = useState<friendStatus>('none');
  const [ loading, setLoading ] = useState(false);

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
      } catch {
        setStatus('unavailable');
      }
    };

    fetchStatus();
  }, [ user, slug ]);

  const handleSendRequest = async () => {
    if (status != 'none') return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/request/${slug}`, {
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        setStatus('outgoing');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  let buttonText = 'Add as friend';
  switch (status) {
    case 'outgoing': buttonText = 'Sent request'; break;
    case 'incoming': buttonText = 'Accept request'; break;
    case 'friends': buttonText = 'You are friends'; break;
    default: break;
  }

  return {
    status,
    loading,
    handleSendRequest,
    buttonText
  };
}