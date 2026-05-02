import { GeneralSettings } from '@rizu/shared';
import { cookies } from 'next/headers';

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const cookieStore = await cookies();

  return {
    theme: cookieStore.get('rizuTheme')?.value || 'light',
    layout: cookieStore.get('rizuLayout')?.value || 'classic'
  }
}