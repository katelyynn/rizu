'use client';

import { RizuPageTitle } from '@/app/components/page/page';
import { RizuTab, RizuTabList } from '@/app/components/page/tab';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <>
      <RizuPageTitle icon="cog" title="Settings" />
      <RizuTabList>
        <RizuTab href="/settings" pathname={pathname}>General</RizuTab>
        <RizuTab href="/settings/profile" pathname={pathname}>Profile</RizuTab>
        <RizuTab href="/settings/privacy" pathname={pathname}>Privacy</RizuTab>
      </RizuTabList>
    </>
  )
}