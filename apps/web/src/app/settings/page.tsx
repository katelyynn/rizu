'use client';

import { useState } from 'react';
import { SettingsTabs } from './components/tab/tab';
import RizuInput from '../components/input/input';

export default function Page() {
  return (
    <>
      <SettingsTabs />
      <AvatarUploader />
    </>
  )
}

function AvatarUploader() {
  const [ avatar, setAvatar ] = useState('');
  const [ error, setError ] = useState('');

  const handleAvatar = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/avatar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }
    } catch {
      setError('something went wrong connecting');
    }
  }

  return (
    <>
      <form onSubmit={handleAvatar}>
        {error && <p>{error}</p>}
        <RizuInput label="Avatar" type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} required />
        <button type="submit">submit</button>
      </form>
    </>
  )
}