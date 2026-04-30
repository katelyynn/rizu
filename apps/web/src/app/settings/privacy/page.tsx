'use client';

import { useAuth } from '@/app/components/auth/auth_context';
import { useEffect, useRef, useState } from 'react';
import { SettingsTabs } from '../components/tab/tab';
import { RizuSettingLine } from '../components/side/side';
import RizuInput from '@/app/components/input/input';
import RizuButton from '@/app/components/button/button';
import { RizuRadio } from '@/app/components/radio/radio';

export default function Page() {
  return (
    <>
      <SettingsTabs />
      <Privacy />
    </>
  )
}
function Privacy() {
  const { user } = useAuth();
  const [ personal, setPersonal ] = useState('');
  const [ possessive, setPossessive ] = useState('');
  const [ error, setError ] = useState('');

  const [ presence, setPresence ] = useState('everyone');
  const [ activity, setActivity ] = useState('everyone');

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
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <RizuSettingLine label="Visibility" desc={`
          Choose how you want to be perceived and by who on the site.
          <br>
          Your presence status displays whether you are online, or recently listened.
          <br>
          Your recent activity can be seen on your profile as the 'Wall'.
          `}>
            <RizuRadio label="Show my presence status to" value={presence} onValueChange={setPresence} items={[
              {
                label: 'Everyone',
                value: 'everyone'
              },
              {
                label: 'Friends only',
                value: 'friends'
              },
              {
                label: 'Nobody',
                value: 'none'
              }
            ]} />
            <RizuRadio label="Show my recent activity to" value={activity} onValueChange={setActivity} items={[
              {
                label: 'Everyone',
                value: 'everyone'
              },
              {
                label: 'Friends only',
                value: 'friends'
              },
              {
                label: 'Nobody',
                value: 'none'
              }
            ]} />
            <RizuRadio label="Show my comments page to" value={activity} onValueChange={setActivity} items={[
              {
                label: 'Everyone',
                value: 'everyone'
              },
              {
                label: 'Friends only',
                value: 'friends'
              },
              {
                label: 'Nobody',
                value: 'none'
              }
            ]} />
        </RizuSettingLine>
        <RizuSettingLine label="Interactions" desc={`
          Choose what actions other users can do in relation to you.
          <br>
          Choosing to show your comments, but limiting who is allowed to post, will show as read-only.
          `}>
            <RizuRadio label="Allow comments from" value={presence} onValueChange={setPresence} items={[
              {
                label: 'Everyone',
                value: 'everyone'
              },
              {
                label: 'Friends only',
                value: 'friends'
              },
              {
                label: 'Nobody',
                value: 'none'
              }
            ]} />
            <RizuRadio label="Allow direct messages from" value={activity} onValueChange={setActivity} items={[
              {
                label: 'Everyone',
                value: 'everyone'
              },
              {
                label: 'Friends only',
                value: 'friends'
              },
              {
                label: 'Nobody',
                value: 'none'
              }
            ]} />
        </RizuSettingLine>
        <RizuButton type="submit" disabled={isDefault}>Save</RizuButton>
      </form>
    </>
  )
}