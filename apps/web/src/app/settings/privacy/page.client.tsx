'use client';

import { PrivacySettings } from '@rizu/shared';
import { useRef, useState } from 'react';
import { RizuSettingLine } from '../components/side/side';
import { RizuRadio } from '@/app/components/radio/radio';
import RizuButton from '@/app/components/button/button';
import { RizuAlert } from '@/app/components/alert/alert';

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
        {!isDefault && <RizuAlert fade type="warn">Your changes are waiting to be saved</RizuAlert>}
        {error && <RizuAlert type="error">{error}</RizuAlert>}
        <RizuSettingLine label="Visibility" desc={`
          Choose how you want to be perceived and by who on the site.
          <br>
          Many of these controls are quite similar to each other, but having too much control over your privacy was never a bad thing.
          <br>
          Any users who are blocked will be treated as *${labels.none}*, regardless of your settings.
          `}>
            <RizuRadio label="Show my presence status to" desc="Displays if you are online, idle, or offline, based on your listening and activity" value={presence} onValueChange={setPresence} items={[
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
            <RizuRadio label="Show my recent activity to" desc="This is shown as the 'Wall' on your profile" value={activity} onValueChange={setActivity} items={[
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
            <RizuRadio label="Show my comments page to" desc="This controls who can *see* your comments page only" value={showComments} onValueChange={setShowComments} items={[
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
            <RizuRadio label="Show my recent listening to" desc="Removes the list from your profile and delays listens in the last 24 hours from appearing" value={recentListening} onValueChange={setRecentListening} items={[
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
            <RizuRadio label="Reveal my library fully to" desc="Hides all in-depth listening data, except for basic counters" value={library} onValueChange={setLibrary} items={[
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
          <br>
          Any users who are blocked will be treated as *${labels.none}*, regardless of your settings.
          `}>
            <RizuRadio label="Allow friend requests from" desc="This will not delete pre-existing incoming requests" value={friends} onValueChange={setFriends} items={[
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
            <RizuRadio label="Allow comments from" desc="This will not delete previous comments" value={openComments} onValueChange={setOpenComments} items={[
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
            <RizuRadio label="Allow direct messages from" desc="This will make any affected previous conversations you had read-only" value={messages} onValueChange={setMessages} items={[
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