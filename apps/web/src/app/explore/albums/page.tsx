import { AlbumSnippet } from '@rizu/shared';
import Link from 'next/link';

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/album`);

  if (!res.ok) {
    return <div>failed</div>;
  }

  const albums: AlbumSnippet[] = await res.json();

  return (
    <>
      <h1>{albums.length} albums</h1>
      {albums.map((album: AlbumSnippet) => (
        <div key={album.id}>
          <strong><Link href={`/album/${album.id}`}>{album.name}</Link></strong>
        </div>
      ))}
    </>
  )
}