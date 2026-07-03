import React from 'react';
import { Tag, TAG_NAMES } from '../definitions/tag';

const tagColors: Record<Tag, { foreground: string; background: string; border?: string }> = {
	sagarstugan: { foreground: '#ffffff', background: '#801818' },
	gasque: { foreground: '#403050', background: '#cc99ff' },
	beer: { foreground: '#432101', background: '#D97a19' },
	wine: { foreground: '#49040c', background: '#ff3d4d' },
	snaps: { foreground: '#8e2a0d', background: '#efb850' },
	punsch: { foreground: '#816501', background: '#f7f143' },
	foreign: { foreground: '#333333', background: '#dee2ee' },
	nerdy: { foreground: '#100a87', background: '#85f27c', border: '#c9123a' },
	esoteric: { foreground: '#365263', background: '#91cae3' },
	solemn: { foreground: '#660ac2', background: '#84f5ea' },
	swe: { foreground: '#004b87', background: '#ffcd00' },
	eng: { foreground: '#00216e', background: '#fa7d7a' },
};

type TagBadgeProps = {
	tag: Tag;
};

export default function TagBadge({ tag }: TagBadgeProps): React.ReactElement {
	const { foreground, background, border } = tagColors[tag];
	return (
		<span
			className="TagBadge"
			style={{ color: foreground, borderColor: border || foreground, backgroundColor: background }}
		>
			{TAG_NAMES[tag].toUpperCase()}
		</span>
	);
}
