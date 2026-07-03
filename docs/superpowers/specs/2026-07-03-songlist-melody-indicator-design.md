# Song list melody indicator — design

## Goal

Show at a glance in the song list which songs have a playable melody.

## Trigger

The indicator renders only when `song.abc` is set — the same condition the song
page uses to show the `MelodyPlayer` (73 of 291 songs at time of writing). The
`melody` text field ("sung to the tune of…") does not trigger it.

## Layout

The clef sits at the start of the lyric-preview line. Item height, the title
row, and the tag pills are unchanged.

```
┌────────────────────────────────────────────┐
│ Vintervisan           (GASQUE) (SWE)       │
│ ♪ Nu har vi ljus här i vårt hus…           │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│ Drunken Sailor        (BEER) (ENG)         │  ← no abc, no clef
│ What shall we do with the drunken…         │
└────────────────────────────────────────────┘
```

## Implementation

- **`SongListItem.tsx`**: wrap the preview `<p>` in a
  `div.flex-row items-center gap-sm` container (existing utility classes).
  When `song.abc` exists, render the existing `TrebleClef` icon
  (`size="sm"`) as the first child, before the `<p>`. The icon cannot go
  inside the `<p>` because the `Icon` wrapper renders a `<div>`, which is
  invalid inside a paragraph.
- **`SongListItem.scss`**: the `<p>` keeps its one-line ellipsis; as a flex
  child that requires `min-width: 0`. The clef is colored
  `rgba(var(--foreground), 0.6)` — same muted tone as the preview text, so it
  reads as metadata rather than a control.

## Behavior

None. The whole list item remains a single link to the song page; the clef is
purely informational — no click target, no tooltip.

## Testing

The project has no test runner; verify visually in the running app that
(1) songs with `abc` show the clef, (2) songs without it are unchanged,
(3) long titles/previews still ellipsize on narrow viewports.
