import { SongSnippet } from '@rizu/shared';
import Link from 'next/link';

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/song`);

  if (!res.ok) {
    return <div>failed</div>;
  }

  const songs: SongSnippet[] = await res.json();

  return (
    <>
      <h1>{songs.length} songs</h1>
      {songs.map((song: SongSnippet) => (
        <div key={song.id}>
          <strong><Link href={`/song/${song.id}`}>{song.name}</Link></strong>
        </div>
      ))}
    </>
  )
}