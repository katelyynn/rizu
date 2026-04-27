import { ArtistSnippet } from '@rizu/shared';
import Link from 'next/link';

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`);

  if (!res.ok) {
    return <div>failed</div>;
  }

  const artists: ArtistSnippet[] = await res.json();

  return (
    <>
      <h1>{artists.length} artists</h1>
      {artists.map((artist: ArtistSnippet) => (
        <div>
          <strong><Link href={`/artist/${artist.id}`}>{artist.name}</Link></strong>
        </div>
      ))}
    </>
  )
}