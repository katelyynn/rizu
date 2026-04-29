import { RizuComments } from '@/app/components/comments/comments';
import NotFound from '@/app/not-found';
import { getUserInfo, UserPage } from '../page';

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await getUserInfo(username);
  if (!user.id) {
    return <NotFound />
  }

  return (
    <UserPage user={user}>
      <RizuComments type="user" id={user.id} />
    </UserPage>
  )
}