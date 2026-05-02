'use client';

import { useAuth } from '@/app/components/auth/auth_context';
import { RizuPageTitle } from '@/app/components/page/page';
import { RizuTab, RizuTabList } from '@/app/components/page/tab';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SettingsTabs() {
  const { general } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <RizuPageTitle icon="cog" title="Settings" />
      <RizuTabList layout={general.layout}>
        <RizuTab href="/settings" pathname={pathname} layout={general.layout}>General</RizuTab>
        <RizuTab href="/settings/profile" pathname={pathname} layout={general.layout}>Profile</RizuTab>
        <RizuTab href="/settings/privacy" pathname={pathname} layout={general.layout}>Privacy</RizuTab>
      </RizuTabList>
    </>
  )
}