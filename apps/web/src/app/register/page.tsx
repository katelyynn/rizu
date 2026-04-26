'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Page() {
  const [ email, setEmail ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState('');
  const router = useRouter();

  const handleRegister = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push('/login');
    } catch {
      setError('something went wrong connecting');
    }
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
        {error && <p>{error}</p>}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">submit</button>
      </form>
    </div>
  )
}