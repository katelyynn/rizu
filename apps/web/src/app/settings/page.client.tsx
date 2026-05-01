'use client';

import { GeneralSettings } from '@rizu/shared';
import { useRef, useState } from 'react';
import { RizuRadio } from '@/app/components/radio/radio';
import RizuButton from '@/app/components/button/button';
import { RizuAlert } from '@/app/components/alert/alert';
import { RizuSettingLine } from './components/side/side';

export function GeneralClient({ settings }: { settings: GeneralSettings }) {
  const [ error, setError ] = useState('');

  const [ language, setLanguage ] = useState(settings.language);
  const [ region, setRegion ] = useState(settings.region);
  const [ theme, setTheme ] = useState(settings.theme);
  const [ layout, setLayout ] = useState(settings.layout);

  const labels = {
    everyone: 'Everyone',
    friends: 'Friends only',
    none: 'Nobody',
    friends_of_friends: 'Friends of friends only'
  }

  const [ save, setSave ] = useState(0);

  const initialData = useRef({
    language,
    region,
    theme,
    layout
  });

  const isDefault =
    initialData.current.language == language &&
    initialData.current.region == region &&
    initialData.current.theme == theme &&
    initialData.current.layout == layout;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/privacy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, region, theme, layout }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      initialData.current = {
        language,
        region,
        theme,
        layout
      };

      setSave(s => s + 1);
    } catch {
      setError('something went wrong connecting');
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {!isDefault && <RizuAlert fade type="warn">Your changes are waiting to be saved</RizuAlert>}
        {error && <RizuAlert type="error">{error}</RizuAlert>}
        <RizuSettingLine label="Localisation" desc={`
          Select the interface language and timezone to use across the site. This is a visual change only.
          `}>
            <RizuRadio label="Language" value={language} onValueChange={setLanguage} items={[
              {
                label: 'English (UK)',
                value: 'en-GB'
              }
            ]} />
            <RizuRadio label="Timezone" value={region} onValueChange={setRegion} items={[
              {
                label: 'System',
                value: 'system'
              }
            ]} />
        </RizuSettingLine>
        <RizuSettingLine label="Layout" desc={`
          Choose what you find most comfortable.
          `}>
            <RizuRadio label="Colour" value={theme} onValueChange={setTheme} items={[
              {
                label: 'Light',
                value: 'light'
              },
              {
                label: 'Dark',
                value: 'dark'
              }
            ]} />
            <RizuRadio label="Theme" desc="Choose between a more classic-style interface or a modernised take" value={layout} onValueChange={setLayout} items={[
              {
                label: 'Classic',
                value: 'classic'
              },
              {
                label: 'Modern',
                value: 'modern'
              }
            ]} />
        </RizuSettingLine>
        <RizuButton type="submit" disabled={isDefault}>Save</RizuButton>
      </form>
    </>
  )
}