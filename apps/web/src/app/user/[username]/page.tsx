import { RizuAbout } from '@/app/components/about/about';
import { RizuProfileActions } from '@/app/components/actions/actions';
import { RizuAvatar } from '@/app/components/avatar/avatar';
import { RizuInfo } from '@/app/components/info/info';
import { RizuPageColumns, RizuPageLeft, RizuPageRight, RizuPageTopInset, RizuPageTopInsetTitle } from '@/app/components/page/page';
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
      <RizuPageTopInset>
        <RizuPageTopInsetTitle>{user.username}</RizuPageTopInsetTitle>
      </RizuPageTopInset>
      <RizuPageColumns>
        <RizuPageLeft>
          <RizuAvatar src={user.avatar} alt={user.username} />
          <RizuProfileActions slug={user.slug} />
          <RizuAbout text={user.about} placeholder={`${user.username} is keeping quiet for now`} />
          <section>
            <RizuInfo label="Joined">
              {join}
            </RizuInfo>
          </section>
        </RizuPageLeft>
        <RizuPageRight>
          <Recents username={username} />
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