import React from 'react';
import axios from 'axios';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Song, SongCollection, SongsWithMeta, SONGS_JSON_URL } from '../definitions/songs';
import { TAGS } from '../definitions/tag';

const SongContext = createContext<{
	songs?: Song[];
	songCollection?: SongCollection;
	loading: boolean;
}>({ loading: false });

export const useSongs = () => useContext(SongContext);

export function SongProvider({ children }: { children: ReactNode }): React.ReactElement {
	const [songs, setSongs] = useState<Song[]>();
	const [songCollection, setSongCollection] = useState<SongCollection>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSongs();
	}, []);

	useEffect(() => {
		if (songs && songCollection) setLoading(false);
	}, [songs, songCollection]);

	function getSongs(): void {
		axios
			.get<SongsWithMeta>(SONGS_JSON_URL)
			.then(({ data }) => {
				const songs = sanitizeSongs(data.songs);
				setSongs(songs);
				setSongCollection(generateSongCollection(songs));
				if (window.navigator.onLine === false)
					toast.warn("You're offline! Using last known songlist");
			})
			.catch(() => {
				toast.error("Couldn't fetch songlist, are you offline?");
				setLoading(false);
			});
	}

	return (
		<SongContext.Provider value={{ songs, songCollection, loading }}>
			{children}
		</SongContext.Provider>
	);
}

// The song data is maintained separately from the app, so it can contain tags
// this build doesn't know yet — drop those instead of crashing the tag badges.
function sanitizeSongs(songs: Song[]): Song[] {
	const knownTags = new Set<string>(TAGS);
	return songs.map((song) => ({
		...song,
		tags: song.tags.filter((tag) => knownTags.has(tag)),
	}));
}

function generateSongCollection(songs?: Song[]): SongCollection | undefined {
	if (!songs) return;

	const songCollection: SongCollection = {};
	songs.forEach((song) => (songCollection[song.id] = song));

	return songCollection;
}
