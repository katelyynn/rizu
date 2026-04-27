import { RizuAvatar } from '@/app/components/avatar/avatar';
import { RizuSong, RizuSongList } from '@/app/components/song/song';
import NotFound from '@/app/not-found';
import { Listen, UserSnippet } from '@rizu/shared';

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${username}`);

  if (!res.ok) {
    return <NotFound />
  }

  const user: UserSnippet = await res.json();

  const join = new Date(user.born).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });

  return (
    <>
      <div>
        <RizuAvatar src={user.avatar} alt={user.username} />
        <strong>{user.username}</strong>
        <p>joined {join}</p>
      </div>
      <Recents username={username} />
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
    <div>
      <h2>journal</h2>
      <RizuSongList>
        {recent.map((recent: Listen) => <RizuSong listen={recent} key={recent.listen.id} />)}
      </RizuSongList>
    </div>
  )
}