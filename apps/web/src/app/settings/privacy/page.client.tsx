'use client';

import { PrivacySettings } from '@rizu/shared';
import { useRef, useState } from 'react';
import { RizuSettingLine } from '../components/side/side';
import { RizuRadio } from '@/app/components/radio/radio';
import RizuButton from '@/app/components/button/button';

export function PrivacyClient({ settings }: { settings: PrivacySettings }) {
  const [ error, setError ] = useState('');

  const [ presence, setPresence ] = useState(settings.presence);
  const [ activity, setActivity ] = useState(settings.activity);
  const [ recentListening, setRecentListening ] = useState(settings.listening);
  const [ library, setLibrary ] = useState(settings.library);
  const [ showComments, setShowComments ] = useState(settings.show_comments);
  const [ openComments, setOpenComments ] = useState(settings.open_comments);
  const [ messages, setMessages ] = useState(settings.messages);
  const [ friends, setFriends ] = useState(settings.friends);

  const labels = {
    everyone: 'Everyone',
    friends: 'Friends only',
    none: 'Nobody',
    friends_of_friends: 'Friends of friends only'
  }

  const [ save, setSave ] = useState(0);

  const initialData = useRef({
    presence,
    activity,
    recentListening,
    library,
    showComments,
    openComments,
    messages,
    friends
  });

  const isDefault =
    initialData.current.presence == presence &&
    initialData.current.activity == activity &&
    initialData.current.recentListening == recentListening &&
    initialData.current.library == library &&
    initialData.current.showComments == showComments &&
    initialData.current.openComments == openComments &&
    initialData.current.messages == messages &&
    initialData.current.friends == friends;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/privacy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presence, activity, recentListening, library, showComments, openComments, messages, friends }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      initialData.current = {
        presence,
        activity,
        recentListening,
        library,
        showComments,
        openComments,
        messages,
        friends
      };

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
                label: labels.everyone,
                value: 'everyone'
              },
              {
                label: labels.friends,
                value: 'friends'
              },
              {
                label: labels.none,
                value: 'none'
              }
            ]} />
            <RizuRadio label="Show my recent activity to" value={activity} onValueChange={setActivity} items={[
              {
                label: labels.everyone,
                value: 'everyone'
              },
              {
                label: labels.friends,
                value: 'friends'
              },
              {
                label: labels.none,
                value: 'none'
              }
            ]} />
            <RizuRadio label="Show my comments page to" value={showComments} onValueChange={setShowComments} items={[
              {
                label: labels.everyone,
                value: 'everyone'
              },
              {
                label: labels.friends,
                value: 'friends'
              },
              {
                label: labels.none,
                value: 'none'
              }
            ]} />
            <RizuRadio label="Show my recent listening to" value={recentListening} onValueChange={setRecentListening} items={[
              {
                label: labels.everyone,
                value: 'everyone'
              },
              {
                label: labels.friends,
                value: 'friends'
              },
              {
                label: labels.none,
                value: 'none'
              }
            ]} />
            <RizuRadio label="Reveal my library fully to" value={library} onValueChange={setLibrary} items={[
              {
                label: labels.everyone,
                value: 'everyone'
              },
              {
                label: labels.friends,
                value: 'friends'
              },
              {
                label: labels.none,
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
                label: labels.everyone,
                value: 'everyone'
              },
              {
                label: labels.friends_of_friends,
                value: 'friends_of_friends'
              },
              {
                label: labels.none,
                value: 'none'
              }
            ]} />
            <RizuRadio label="Allow comments from" value={openComments} onValueChange={setOpenComments} items={[
              {
                label: labels.everyone,
                value: 'everyone'
              },
              {
                label: labels.friends,
                value: 'friends'
              },
              {
                label: labels.none,
                value: 'none'
              }
            ]} />
            <RizuRadio label="Allow direct messages from" value={messages} onValueChange={setMessages} items={[
              {
                label: labels.everyone,
                value: 'everyone'
              },
              {
                label: labels.friends,
                value: 'friends'
              },
              {
                label: labels.none,
                value: 'none'
              }
            ]} />
        </RizuSettingLine>
        <RizuButton type="submit" disabled={isDefault}>Save</RizuButton>
      </form>
    </>
  )
}