import { useMatch } from '@tanstack/react-location';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import AddToBookmarkModal from '../components/AddToBookmarkModal';
import MelodyPlayer from '../components/MelodyPlayer';
import Spinner from '../components/Spinner';
import TagBadge from '../components/TagBadge';
import { useSongs } from '../context/songContext';
import AddToBookmark from '../icons/AddToBookmark';
import LinkTo from '../icons/LinkTo';

export default function SongDetails(): React.ReactElement {
	const { songCollection, loading } = useSongs();
	const {
		params: { songId },
	} = useMatch();
	const song = songCollection?.[songId];
	const [addToBookmarkModalOpen, setAddToBookmarkModalOpen] = useState<boolean>(false);

	function writeLinkToClipboard() {
		if (song)
			navigator.clipboard
				.writeText(`${window.location.origin}/s/${song.id}`)
				.then(() => toast.success('Link copied'));
	}

	return (
		<main className="Song">
			{loading ? (
				<Spinner />
			) : song ? (
				<>
					<div className="flex-row space-between items-start">
						<h1>{song.title}</h1>
						<div className="flex-row">
							<button
								className="action"
								aria-label="Copy link to song"
								onClick={writeLinkToClipboard}
							>
								<LinkTo />
							</button>
							<button
								className="action"
								aria-label="Add to list"
								onClick={() => setAddToBookmarkModalOpen(true)}
							>
								<AddToBookmark />
							</button>
						</div>
					</div>
					<div>
						{song.author && <h3>By: {song.author}</h3>}
						{song.melody && (
							<h3>
								Melody: {song.melody} {song.composer && `(${song.composer})`}
							</h3>
						)}
						{song.abc && <MelodyPlayer key={song.id} abc={song.abc} />}
					</div>
					<div className="tag-row">
						{song.tags.map((tag) => (
							<TagBadge tag={tag} key={tag} />
						))}
					</div>

					{song.notes && (
						<details open>
							<summary>Notes about the song</summary>
							<ul className="notes">
								{song.notes.map((note, i) => (
									<li key={i}>{note}</li>
								))}
							</ul>
						</details>
					)}

					<div className="song-content">
						<ReactMarkdown components={{ h1: ({ children }) => <h2>{children}</h2> }}>
							{song.content || ''}
						</ReactMarkdown>
					</div>

					<AddToBookmarkModal
						isOpen={addToBookmarkModalOpen}
						onClose={() => setAddToBookmarkModalOpen(false)}
						song={song}
					/>
				</>
			) : (
				<h2 className="self-center" style={{ textAlign: 'center' }}>
					{"Couldn't find the song you were looking for :("}
				</h2>
			)}
		</main>
	);
}
