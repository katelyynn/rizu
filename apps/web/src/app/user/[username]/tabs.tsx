'use client';

import { useAuth } from '@/app/components/auth/auth_context';
import { RizuTab, RizuTabList } from '@/app/components/page/tab';
import { UserSnippet } from '@rizu/shared';
import { usePathname } from 'next/navigation';

export function UserTabs({ user }: { user: UserSnippet }) {
  const { general } = useAuth();
  const pathname = usePathname();

  return (
    <RizuTabList standalone={false} layout={general.layout}>
      <RizuTab href={`/user/${user.slug}`} pathname={pathname} layout={general.layout}>
        Wall
      </RizuTab>
      <RizuTab href={`/user/${user.slug}/library`} pathname={pathname} layout={general.layout}>
        Library
      </RizuTab>
      <RizuTab href={`/user/${user.slug}/friends`} pathname={pathname} layout={general.layout}>
        Friends
      </RizuTab>
      <RizuTab href={`/user/${user.slug}/comments`} pathname={pathname} layout={general.layout}>
        Comments
      </RizuTab>
    </RizuTabList>
  )
}