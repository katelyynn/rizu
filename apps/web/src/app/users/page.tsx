import { UserSnippet } from '@rizu/shared';
import Link from 'next/link';

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`);

  if (!res.ok) {
    return <div>failed</div>;
  }

  const users: UserSnippet[] = await res.json();

  return (
    <>
      <h1>{users.length} users</h1>
      {users.map((user: UserSnippet) => (
        <div key={user.id}>
          <strong><Link href={`/user/${user.slug}`}>{user.username}</Link></strong>
        </div>
      ))}
    </>
  )
}