'use client';

import { useState } from 'react';
import RizuInput from '../components/input/input';
import RizuButton from '../components/button/button';

export default function Page() {
  const [ songName, setSongName ] = useState('');
  const [ artistName, setArtistName ] = useState('');
  const [ albumName, setAlbumName ] = useState('');
  const [ albumArtistName, setAlbumArtistName ] = useState('');
  const [ duration, setDuration ] = useState(0);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState('');

  const handleListen = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!songName || !artistName) return;

    setLoading(true);
    setError('');

    try {
      const payload: Record<string, any> = {
        songName,
        artistName
      };

      if (albumName) payload.albumName = albumName;
      if (albumArtistName) payload.albumArtistName = albumArtistName;
      if (duration) payload.duration = duration;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setSongName('');
        setArtistName('');
        setAlbumName('');
        setAlbumArtistName('');
        setDuration(0);
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>create listen</h1>
      <form onSubmit={handleListen}>
        <RizuInput label="Song" type="text" value={songName} onChange={(e) => setSongName(e.target.value)} required />
        <RizuInput label="Artist" type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
        <RizuInput label="Album" type="text" value={albumName} onChange={(e) => setAlbumName(e.target.value)} />
        <RizuInput label="Album artist" type="text" value={albumArtistName} onChange={(e) => setAlbumArtistName(e.target.value)} />
        <RizuInput label="Duration" type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        <RizuButton type="submit" disabled={loading || !songName || !artistName}>
          {loading ? 'sending...' : 'submit'}
        </RizuButton>
        {error && (
          <div>
            {error}
          </div>
        )}
      </form>
    </>
  )
}