import Link from 'next/link';

export default function Page() {
  return (
    <>
      <h1>explore</h1>
      <p>links of interest: <Link href="/explore/artists">artists</Link> | <Link href="/explore/albums">albums</Link> | <Link href="/explore/songs">songs</Link></p>
    </>
  )
}