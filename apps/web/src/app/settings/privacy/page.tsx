import { SettingsTabs } from '../components/tab/tab';
import { PrivacySettings } from '@rizu/shared';
import { PrivacyClient } from './page.client';
import { cookies } from 'next/headers';

export default function Page() {
  return (
    <>
      <SettingsTabs />
      <Privacy />
    </>
  )
}

export async function Privacy() {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/privacy`, {
    headers: {
      Cookie: cookieStore.toString()
    }
  });

  console.info(res);

  if (!res.ok) {
    return <div>failed</div>;
  }

  const settings: PrivacySettings = await res.json();

  return <PrivacyClient settings={settings} />
}