# Song List Melody Indicator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a muted treble-clef icon at the start of the lyric-preview line in the song list for songs that have a playable melody (`song.abc` set).

**Architecture:** Pure presentation change in one component and its stylesheet. The preview `<p>` in `SongListItem` gets wrapped in a flex-row container so the existing `TrebleClef` icon (whose `Icon` wrapper renders a `<div>`, invalid inside `<p>`) can sit before it. Muted color is set on the wrapper and inherited by both icon (`currentColor`) and text.

**Tech Stack:** React 18 + TypeScript, Vite, SCSS. Existing utility classes from `src/style/shared.scss` (`flex-row`, `items-center`, `gap-sm`).

## Global Constraints

- Indicator triggers on `song.abc` only — never on the `melody` text field (spec: "Trigger").
- No change to item height, title row, or tag pills (spec: "Layout").
- Clef color is `rgba(var(--foreground), 0.6)`, same as preview text (spec: "Implementation").
- No new click targets or tooltips — the whole item stays one link (spec: "Behavior").
- **This project has no test runner.** Verification is `yarn build` (runs `tsc`) plus visual checks in the dev server (spec: "Testing"). `yarn lint` runs prettier in check mode.

---

### Task 1: Render muted treble clef in the song list preview line

**Files:**
- Modify: `src/components/SongListItem.tsx`
- Modify: `src/style/components/SongListItem.scss:24-31`

**Interfaces:**
- Consumes: `Song.abc?: string` from `src/definitions/songs.ts`; `TrebleClef` from `src/icons/TrebleClef.tsx` (props: `size?: 'sm' | 'md' | 'lg'`); utility classes `flex-row`, `items-center`, `gap-sm` from `src/style/shared.scss`.
- Produces: nothing consumed by later tasks (single-task plan).

- [ ] **Step 1: Update the component**

Replace the full contents of `src/components/SongListItem.tsx` with:

```tsx
import { Link } from '@tanstack/react-location';
import React from 'react';
import { Song } from '../definitions/songs';
import TrebleClef from '../icons/TrebleClef';
import TagBadge from './TagBadge';

type SongItemProps = {
	song: Song;
	from?: 'home' | 'list';
};

export default function SongItem({ song, from }: SongItemProps): React.ReactElement {
	return (
		<Link to={`/s/${song.id}`} search={from && { from }} className="SongListItem">
			<li>
				<div>
					<div className="flex-row space-between items-center">
						<h1>{song.title}</h1>
						<div className="flex-row gap-sm">
							{song.tags.map((tag) => (
								<TagBadge tag={tag} key={tag} />
							))}
						</div>
					</div>
					<div className="preview flex-row items-center gap-sm">
						{song.abc && <TrebleClef size="sm" />}
						<p>
							{song.content
								.split('\n\n')
								.filter((paragraph) => !paragraph.startsWith('> ') && !paragraph.startsWith('# '))
								.join('\n')}
						</p>
					</div>
				</div>
			</li>
		</Link>
	);
}
```

Changes from the current file: import `TrebleClef`, wrap the preview `<p>` in `div.preview.flex-row.items-center.gap-sm`, and render `<TrebleClef size="sm" />` before the `<p>` when `song.abc` is set.

- [ ] **Step 2: Update the stylesheet**

In `src/style/components/SongListItem.scss`, replace the `p { ... }` block (lines 24–31, inside `> li > div`):

```scss
		p {
			margin: 0.2rem 0 0 0;
			font-size: 0.875rem;
			color: rgba(var(--foreground), 0.6);
			white-space: nowrap;
			overflow-x: hidden;
			text-overflow: ellipsis;
		}
```

with:

```scss
		.preview {
			margin-top: 0.2rem;
			color: rgba(var(--foreground), 0.6);

			p {
				margin: 0;
				min-width: 0;
				font-size: 0.875rem;
				white-space: nowrap;
				overflow-x: hidden;
				text-overflow: ellipsis;
			}
		}
```

Why: the top margin moves from `<p>` to the wrapper so the icon and text center-align as one line; `min-width: 0` lets the `<p>` shrink inside the flex row so `text-overflow: ellipsis` keeps working; the color on `.preview` is inherited by both the text and the clef's `currentColor` fill.

- [ ] **Step 3: Verify it compiles and is formatted**

Run: `yarn build && yarn lint`
Expected: `tsc` and `vite build` succeed with no errors; prettier reports "All matched files use Prettier code style!"

- [ ] **Step 4: Verify visually in the dev server**

Run: `yarn dev` and open the printed localhost URL (Vite defaults to http://localhost:5173).

Check in the song list:
1. Roughly a quarter of songs (73 of 291) show a small muted clef at the start of the preview line; open one to confirm the song page shows the melody player (same `abc` condition).
2. Songs without a clef look exactly as before — same height, same title/tag row.
3. Narrow the viewport (mobile width): long preview lines still ellipsize on one line and the clef is not squashed.
4. The clef's color matches the preview text (muted, not the accent color).

Expected: all four hold.

- [ ] **Step 5: Commit**

```bash
git add src/components/SongListItem.tsx src/style/components/SongListItem.scss
git commit -m "Show a muted treble clef in the song list for songs with a melody"
```

---

## Verification checklist (spec coverage)

- Trigger on `song.abc` only → Task 1 Step 1 (`{song.abc && ...}`)
- Clef at start of preview line, no height/title/tag changes → Task 1 Steps 1–2, checked in Step 4
- Muted color matching preview text → Task 1 Step 2, checked in Step 4
- No behavior change (single link, no tooltip) → Task 1 Step 1 adds no handlers/targets
- Visual testing (no test runner) → Task 1 Steps 3–4
