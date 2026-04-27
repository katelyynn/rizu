import NotFound from '@/app/not-found';

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${username}`);

  if (!res.ok) {
    return <NotFound />
  }

  const user = await res.json();

  const join = new Date(user.born).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });

  return (
    <div>
      <strong>{user.username}</strong>
      <p>joined {join}</p>
    </div>
  )
}