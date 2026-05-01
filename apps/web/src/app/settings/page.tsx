import { GeneralSettings, PrivacySettings } from '@rizu/shared';
import { cookies } from 'next/headers';
import { SettingsTabs } from './components/tab/tab';
import { GeneralClient } from './page.client';

export default function Page() {
  return (
    <>
      <SettingsTabs />
      <General />
    </>
  )
}

async function General() {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/general`, {
    headers: {
      Cookie: cookieStore.toString()
    }
  });

  console.info(res);

  if (!res.ok) {
    return <div>failed</div>;
  }

  const settings: GeneralSettings = await res.json();

  return <GeneralClient settings={settings} />
}