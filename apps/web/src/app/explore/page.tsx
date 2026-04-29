import Link from 'next/link';
import { RizuPageTitle } from '../components/page/page';

export default function Page() {
  return (
    <>
      <RizuPageTitle icon="zoom" title="Explore" />
      <p>links of interest: <Link href="/explore/artists">artists</Link> | <Link href="/explore/albums">albums</Link> | <Link href="/explore/songs">songs</Link></p>
    </>
  )
}