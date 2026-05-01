'use client';

import { useEffect, useRef, useState } from 'react';
import { SettingsTabs } from './components/tab/tab';
import RizuInput from '../components/input/input';
import { useAuth } from '../components/auth/auth_context';
import RizuButton from '../components/button/button';
import { RizuSettingLine } from './components/side/side';
import { Author } from '@rizu/shared';
import NotFound from '../not-found';

export default function Page() {
  const { user } = useAuth();

  // wip
  if (!user) return <NotFound />

  return (
    <>
      <SettingsTabs />
      <AvatarUploader user={user} />
      <Pronouns user={user} />
    </>
  )
}

function AvatarUploader({ user }: { user: Author }) {
  const [ avatar, setAvatar ] = useState('');
  const [ error, setError ] = useState('');

  const [ save, setSave ] = useState(0);

  const initialData = useRef({
    avatar: user?.avatar || ''
  });

  const isDefault = !user || (avatar == initialData.current.avatar);

  useEffect(() => {
    setAvatar(user?.avatar || '');

    initialData.current = {
      avatar: user?.avatar || ''
    };
  }, [ user ]);

  const handleAvatar = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/profile/avatar`, {
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

      initialData.current = {
        avatar
      };

      setSave(s => s + 1);
    } catch {
      setError('something went wrong connecting');
    }
  }

  return (
    <RizuSettingLine label="Avatar" desc="Showcase yourself in a way beyond words. Please provide a link in the meantime before an uploader is available.">
      <form onSubmit={handleAvatar}>
        {error && <p>{error}</p>}
        <RizuInput label="Direct link" type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} required />
        <RizuButton type="submit" disabled={isDefault}>Save</RizuButton>
      </form>
    </RizuSettingLine>
  )
}

function Pronouns({ user }: { user: Author }) {
  const [ personal, setPersonal ] = useState('');
  const [ possessive, setPossessive ] = useState('');
  const [ error, setError ] = useState('');

  const [ save, setSave ] = useState(0);

  const initialData = useRef({
    personal: user?.pronouns?.personal || '',
    possessive: user?.pronouns?.possessive || ''
  });

  const isDefault = !user || (personal == initialData.current.personal && possessive == initialData.current.possessive);

  useEffect(() => {
    setPersonal(user?.pronouns.personal || '');

    setPossessive(user?.pronouns.possessive || '');

    initialData.current = {
      personal: user?.pronouns.personal || '',
      possessive: user?.pronouns.possessive || ''
    }
  }, [ user ]);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/profile/pronouns`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personal, possessive }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      initialData.current = {
        personal,
        possessive
      }

      setSave(s => s + 1);
    } catch {
      setError('something went wrong connecting');
    }
  }

  return (
    <>
      <RizuSettingLine label="Pronouns" desc={`
        Declare the most comfortable way of being referred to, displaying on your profile and used like so:
        <br>
        ${user.username} updated **${possessive}** profile
        ${user.username} reached 10,000 listens, **${personal}** is now #1
        `}>
        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          <RizuInput label="Personal" type="text" value={personal} onChange={(e) => setPersonal(e.target.value)} required />
          <RizuInput label="Possessive" type="text" value={possessive} onChange={(e) => setPossessive(e.target.value)} required />
          <RizuButton type="submit" disabled={isDefault}>Save</RizuButton>
        </form>
      </RizuSettingLine>
    </>
  )
}