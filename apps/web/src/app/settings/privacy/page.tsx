'use client';

import { useAuth } from '@/app/components/auth/auth_context';
import { SettingsTabs } from '../components/tab/tab';
import { RizuSettingLine } from '../components/side/side';
import RizuInput from '@/app/components/input/input';
import RizuButton from '@/app/components/button/button';
import { RizuRadio } from '@/app/components/radio/radio';
import NotFound from '@/app/not-found';
import { Author, PrivacySettings } from '@rizu/shared';
import { Privacy } from './page.server';
import { useState } from 'react';

export default function Page() {
  const { user } = useAuth();

  // wip
  if (!user) return <NotFound />

  return (
    <>
      <SettingsTabs />
      <Privacy user={user} />
    </>
  )
}

export function PrivacyClient({ user, settings }: { user: Author, settings: PrivacySettings }) {
  const [ error, setError ] = useState('');

  const [ presence, setPresence ] = useState(settings.presence);
  const [ activity, setActivity ] = useState(settings.activity);
  const [ recentListening, setRecentListening ] = useState(settings.listening);
  const [ library, setLibrary ] = useState(settings.library);
  const [ showComments, setShowComments ] = useState(settings.show_comments);
  const [ openComments, setOpenComments ] = useState(settings.open_comments);
  const [ messages, setMessages ] = useState(settings.messages);
  const [ friends, setFriends ] = useState(settings.friends);

  const [ save, setSave ] = useState(0);

  const isDefault = false;

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
            <RizuRadio label="Show my comments page to" value={showComments} onValueChange={setShowComments} items={[
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
            <RizuRadio label="Show my recent listening to" value={recentListening} onValueChange={setRecentListening} items={[
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
            <RizuRadio label="Reveal my library fully to" value={library} onValueChange={setLibrary} items={[
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
            <RizuRadio label="Allow friend requests from" value={friends} onValueChange={setFriends} items={[
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
            <RizuRadio label="Allow comments from" value={openComments} onValueChange={setOpenComments} items={[
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
            <RizuRadio label="Allow direct messages from" value={messages} onValueChange={setMessages} items={[
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