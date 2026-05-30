import { useMatch } from '@tanstack/react-location';
import Fuse from 'fuse.js';
import React, { useEffect, useMemo, useState } from 'react';
import SongListItem from '../components/SongListItem';
import Spinner from '../components/Spinner';
import { useSearch } from '../context/searchContext';
import { useSongs } from '../context/songContext';
import { Song } from '../definitions/songs';

const normalize = (s: string) =>
	s
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^\p{L}\p{N}]/gu, '')
		.toLowerCase();

export default function SongList(): React.ReactElement {
	const { data, search: searchParams } = useMatch();
	const { ids: songIds } = data as { ids?: number[] };
	const { name } = searchParams as { name?: string };
	const { songs, songCollection, loading: loadingSongs } = useSongs();
	const { search, filter } = useSearch();

	const [baseSongs, setBaseSongs] = useState<Song[]>();
	const [displaySongs, setDisplaySongs] = useState<Song[]>();
	const [loading, setLoading] = useState<boolean>(true);

	const isFilteredList = !!songIds;

	const fuse = useMemo(() => {
		if (!baseSongs) return null;
		return new Fuse(baseSongs, {
			keys: ['title'],
			threshold: 0.4,
			ignoreLocation: true,
			getFn: (song) => normalize(song.title),
		});
	}, [baseSongs]);

	useEffect(() => {
		if (!songs) return;
		if (!isFilteredList) return setBaseSongs(songs);

		const listSongs: Song[] = [];
		const uniqueness: Record<number, true> = {};
		songIds.forEach((id) => {
			if (songCollection?.[id] && !uniqueness[id]) {
				listSongs.push(songCollection[id]);
				uniqueness[id] = true;
			}
		});
		setBaseSongs(listSongs);
	}, [songs, songCollection, songIds]);

	useEffect(() => {
		if (!baseSongs) return;
		const normalizedSearch = normalize(search);
		if (!normalizedSearch && !filter.length) return setDisplaySongs(baseSongs);

		const tagFiltered = filter.length
			? baseSongs.filter((song) => filter.every((tag) => song.tags.includes(tag)))
			: baseSongs;

		if (!normalizedSearch) return setDisplaySongs(tagFiltered);

		const tagFilteredIds = new Set(tagFiltered.map((s) => s.id));

		const titleSubstringHits = tagFiltered.filter((song) =>
			normalize(song.title).includes(normalizedSearch),
		);

		const titleFuzzyHits = (fuse?.search(normalizedSearch) ?? [])
			.map((result) => result.item)
			.filter((song) => tagFilteredIds.has(song.id));

		const contentHits = tagFiltered.filter((song) =>
			normalize(song.content).includes(normalizedSearch),
		);

		const seen = new Set<number>();
		const merged: Song[] = [];
		for (const song of [...titleSubstringHits, ...titleFuzzyHits, ...contentHits]) {
			if (!seen.has(song.id)) {
				seen.add(song.id);
				merged.push(song);
			}
		}

		setDisplaySongs(merged);
	}, [baseSongs, fuse, search, filter]);

	useEffect(() => {
		setLoading(loadingSongs || !songs || !baseSongs || !displaySongs);
	}, [songs, baseSongs, displaySongs, loadingSongs]);

	function noSongsString(): string {
		if (!songs?.length) return 'Could not find any songs :(';
		if (isFilteredList && songIds.length >= 0) return 'There are no songs in this list :(';
		if (!baseSongs?.length) return "Couldn't find any songs with the IDs from the list :(";
		if (!displaySongs?.length) {
			const params: string[] = [];
			if (search) params.push('search');
			if (filter.length) params.push('filter');
			return `Couldn't find any songs matching your ${params.join(' and ')} :/`;
		}

		return 'Something went wrong :/';
	}

	return (
		<main className="SongList">
			{isFilteredList && name && <h1>{name}</h1>}
			{loading ? (
				<Spinner />
			) : displaySongs?.length ? (
				<ul>
					{displaySongs.map((song) => (
						<SongListItem song={song} from={isFilteredList ? 'list' : 'home'} key={song.id} />
					))}
				</ul>
			) : (
				<h2 className="no-songs">{noSongsString()}</h2>
			)}
		</main>
	);
}
