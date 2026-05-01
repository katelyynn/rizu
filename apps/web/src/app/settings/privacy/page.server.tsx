'use server';

import { Author, PrivacySettings } from '@rizu/shared';
import { PrivacyClient } from './page';

export async function Privacy({ user }: { user: Author }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/privacy`);

  if (!res.ok) {
    return <div>failed</div>;
  }

  const settings: PrivacySettings = await res.json();

  return <PrivacyClient user={user} settings={settings} />
}