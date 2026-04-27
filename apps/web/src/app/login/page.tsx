'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useAuth } from '../components/auth/auth_context';
import RizuInput from '../components/input/input';

export default function Page() {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');
  const router = useRouter();

  const { setUser } = useAuth();

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setUser(data.user);

      router.push('/');
    } catch {
      setError('something went wrong connecting');
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        {error && <p>{error}</p>}
        <RizuInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <RizuInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">submit</button>
      </form>
    </div>
  )
}