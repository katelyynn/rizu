import { RizuAbout } from '@/app/components/about/about';
import { RizuProfileActions } from '@/app/components/actions/actions';
import { RizuAvatar } from '@/app/components/avatar/avatar';
import { RizuComments } from '@/app/components/comments/comments';
import { RizuInfo } from '@/app/components/info/info';
import { RizuPageColumns, RizuPageLeft, RizuPageRight, RizuPageTopInset, RizuPageTopInsetTitle } from '@/app/components/page/page';
import { RizuTab, RizuTabList } from '@/app/components/page/tab';
import { RizuSong, RizuSongList } from '@/app/components/song/song';
import NotFound from '@/app/not-found';
import { Activity, Friend, Listen, UserSnippet, UserStats } from '@rizu/shared';
import React from 'react';
import { UserTabs } from './tabs';
import { RizuUser, RizuUserList } from '@/app/components/user/user';
import { RizuActivity, RizuWall, RizuWallGroup } from '@/app/components/wall/wall';
import { DateTime } from 'luxon';

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await getUserInfo(username);
  if (!user.id) {
    return <NotFound />
  }

  return (
    <UserPage user={user}>
      <Wall username={user.slug} />
      <Recents username={user.slug} />
      <RizuComments type="user" id={user.id} short />
    </UserPage>
  )
}

export async function getUserInfo(username: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${username}`);

  if (!res.ok) {
    return {
      id: '',
      username: '',
      slug: '',
      born: ''
    };
  }

  const user: UserSnippet = await res.json();

  return user;
}

export async function UserPage({ user, children }: { user: UserSnippet, children: React.ReactNode }) {
  const join = new Date(user.born).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });

  return (
    <>
      <RizuPageColumns>
        <RizuPageLeft>
          <RizuAvatar src={user.avatar} alt={user.username} big />
          <RizuProfileActions slug={user.slug} />
          <RizuAbout text={user.about} placeholder={`${user.username} is keeping quiet for now`} />
          <section>
            <RizuInfo label="Joined">
              {join}
            </RizuInfo>
            <Stats username={user.slug} />
          </section>
          <Friends username={user.slug} />
        </RizuPageLeft>
        <RizuPageRight>
          <RizuPageTopInset>
            <RizuPageTopInsetTitle>{user.username}</RizuPageTopInsetTitle>
            <UserTabs user={user} />
          </RizuPageTopInset>
          {children}
        </RizuPageRight>
      </RizuPageColumns>
    </>
  )
}

export async function Recents({ username }: { username: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${username}/recent`);

  if (!res.ok) {
    return <NotFound />
  }

  const recent = await res.json();

  return (
    <section>
      <h3>Recent listening</h3>
      <RizuSongList>
        {recent.map((recent: Listen) => <RizuSong listen={recent} key={recent.listen.id} />)}
      </RizuSongList>
    </section>
  )
}

async function Stats({ username }: { username: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${username}/stats`);

  if (!res.ok) {
    return <NotFound />
  }

  const stats: UserStats = await res.json();

  return (
    <>
      <RizuInfo label="Listens">{stats.listens}</RizuInfo>
      <RizuInfo label="Artists">{stats.artists}</RizuInfo>
      <RizuInfo label="Albums">{stats.albums}</RizuInfo>
      <RizuInfo label="Songs">{stats.songs}</RizuInfo>
    </>
  )
}

async function Friends({ username }: { username: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/list/${username}`);

  if (!res.ok) {
    return <NotFound />
  }

  const friends: Friend[] = await res.json();

  return (
    <section>
      <h4>Friends</h4>
      <RizuUserList>
        {friends.map((friend: Friend) => <RizuUser key={friend.friend.id} friend={friend} />)}
      </RizuUserList>
    </section>
  )
}

async function Wall({ username }: { username: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities/${username}`);

  if (!res.ok) {
    return <NotFound />
  }

  const activities: Activity[] = await res.json();

  interface group {
    header: string,
    activities: Activity[]
  }

  const grouped: group[] = Object.values(
    activities.reduce((acc, activity) => {
      const date = DateTime.fromISO(activity.created);

      let day;
      if (date.hasSame(DateTime.now(), 'day')) {
        day = 'Today';
      } else if (date.hasSame(DateTime.now().minus({ days: 1 }), 'day')) {
        day = 'Yesterday';
      } else {
        day = date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
      }

      if (!acc[day]) {
        acc[day] = {
          header: day,
          activities: []
        }
      }

      acc[day].activities.push(activity);
      return acc;
    }, {})
  );

  return (
    <section>
      <h3>Wall</h3>
      <RizuWall>
        {grouped.map((group: group) => (
          <RizuWallGroup key={group.header} header={group.header}>
            {group.activities.map((activity: Activity) => <RizuActivity key={activity.id} activity={activity} />)}
          </RizuWallGroup>
        ))}
      </RizuWall>
    </section>
  )
}