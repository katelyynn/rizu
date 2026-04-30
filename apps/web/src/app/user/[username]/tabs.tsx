'use client';

import { RizuTab, RizuTabList } from '@/app/components/page/tab';
import { UserSnippet } from '@rizu/shared';
import { usePathname } from 'next/navigation';

export function UserTabs({ user }: { user: UserSnippet }) {
  const pathname = usePathname();

  return (
    <RizuTabList standalone={false}>
      <RizuTab href={`/user/${user.slug}`} pathname={pathname}>
        Wall
      </RizuTab>
      <RizuTab href={`/user/${user.slug}/library`} pathname={pathname}>
        Library
      </RizuTab>
      <RizuTab href={`/user/${user.slug}/friends`} pathname={pathname}>
        Friends
      </RizuTab>
      <RizuTab href={`/user/${user.slug}/comments`} pathname={pathname}>
        Comments
      </RizuTab>
    </RizuTabList>
  )
}