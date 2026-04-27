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