export interface UserSnippet {
  id: string,
  username: string,
  slug: string,
  born: string
}

export interface ArtistSnippet {
  id: string,
  name: string
}

export interface AlbumSnippet {
  id: string,
  name: string,
  artist: string
}

export interface SongSnippet {
  id: string,
  name: string,
  artist: string
}

export interface Artist {
  id: string,
  name: string,
  mbid?: string
}

export interface Album {
  id: string,
  name: string,
  artist: Artist,
  mbid?: string
}

export interface Song {
  id: string,
  name: string,
  artist: Artist,
  album?: Album
}

export interface Listen {
  listen: {
    id: string,
    duration?: number,
    played: string
  },
  song: Song,
  artist: Artist,
  album?: Album
}