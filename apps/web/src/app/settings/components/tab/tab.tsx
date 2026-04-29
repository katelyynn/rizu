import { RizuPageTitle } from '@/app/components/page/page';
import Link from 'next/link';

export function SettingsTabs() {
  return (
    <>
      <RizuPageTitle icon="cog" title="Settings" />
      <p><Link href="/settings">profile</Link></p>
    </>
  )
}