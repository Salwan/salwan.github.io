# EPUB Reader v0.5.8 — Platform-Independent Design Document

**Baseline:** the production EPUB Reader 0.5.8 application, including the Milestone 5.5 features and the accepted blank-page navigation fix.

**Purpose:** specify enough product behavior, presentation, data semantics, and engineering decisions to reimplement the application on another hardware/firmware/operating-system combination with near feature parity.

**Prepared:** 2026-10-17, from the project documentation, production source, assets, build configuration, and verification records.

## Contents

1. [Scope and interpretation](#1-scope-and-interpretation)
2. [Product principles and feature inventory](#2-product-principles-and-feature-inventory)
3. [Logical architecture and ownership](#3-logical-architecture-and-ownership)
4. [Core domain model and invariants](#4-core-domain-model-and-invariants)
5. [Application lifecycle and screen state machine](#5-application-lifecycle-and-screen-state-machine)
6. [Semantic input and arbitration](#6-semantic-input-and-arbitration)
7. [Library, indexing, and folder settings](#7-library-indexing-and-folder-settings)
8. [EPUB layout, rendering, and reading position](#8-epub-layout-rendering-and-reading-position)
9. [Reader popup and jump slider](#9-reader-popup-and-jump-slider)
10. [Visual design and composition](#10-visual-design-and-composition)
11. [Ambient music and navigation sound](#11-ambient-music-and-navigation-sound)
12. [Volume integration](#12-volume-integration)
13. [Battery observation and low-power behavior](#13-battery-observation-and-low-power-behavior)
14. [Durable state, compatibility, and recovery](#14-durable-state-compatibility-and-recovery)
15. [Platform adaptation contracts](#15-platform-adaptation-contracts)
16. [Failure behavior and operational diagnostics](#16-failure-behavior-and-operational-diagnostics)
17. [Responsiveness and resource budgets](#17-responsiveness-and-resource-budgets)
18. [Port acceptance specification](#18-port-acceptance-specification)
19. [Reference implementation and traceability](#19-reference-implementation-and-traceability)

---

## 1. Scope and interpretation

### 1.1 What this document specifies

The application is an offline, local-file, paginated EPUB reader with a compact book library, persistent reading positions, six color themes, three font presets, an integrated ambient MP3 player, and battery-aware protection of reading state.

The product is optimized for uninterrupted prose reading using a small set of directional and action controls. Its identity is the combination of its deliberately quiet reading screen, discoverable overlays, predictable controls, reliable resume, and ambient audio.

In this document:

- **Behavioral requirements** describe the current production application. Preserve these for feature parity.
- **Reference values** describe how 0.5.8 realizes those behaviors. They allow a close visual or implementation match without requiring the original display, operating system, or libraries.
- **Port adaptation** identifies choices that necessarily depend on the destination platform. Preserve their stated semantics when changing their mechanism.
- **Limitations** describe the baseline honestly; they are not additional implementation requirements or promises of unsupported functionality.

The source implementation takes precedence over historical proposals when they differ. For example, the current app has six compiled-in palettes, nonrecursive file discovery, position-based library grouping, and no manual shutdown shortcut. Earlier brainstorm references to YAML themes, a one-row progress bar, or different popup contents do not describe 0.5.8.

### 1.2 Independence from the original platform

No particular CPU, framebuffer API, keycode, filesystem mount point, mixer, package format, battery node, or shutdown executable is a portable product requirement. A port may replace C++/SDL/CRengine/mpg123 with suitable alternatives if it preserves the contracts here.

However, **feature parity, visual parity, and state-file compatibility are different goals**:

- Feature parity preserves interactions and outcomes, including edge cases.
- Close visual parity also preserves typography, palettes, density, proportions, and restrained chrome.
- Existing-bookmark compatibility additionally requires compatible content identities and an interpretation of the stored text anchors. Changing the rendering engine does not automatically preserve CRengine XPointer compatibility.

Page counts may legitimately differ with viewport, fonts, or layout engine. A port must preserve the reading location rather than assume that an old page number identifies the same text.

### 1.3 Supported content and limits

| Area | Baseline |
|---|---|
| Books | Local, unprotected, reflowable EPUB 2 and EPUB 3 prose |
| Primary language | English; UTF-8 text with the bundled font's Unicode coverage |
| Structures | Paragraphs, headings, emphasis, lists, blockquotes, explicit breaks, chapter boundaries, raster illustrations |
| Images | PNG and JPEG decoding enabled; illustrations retain original colors |
| Audio | Local MP3 files, including mono/stereo and rates converted to output format |
| Navigation | Sequential pages and percentage jump; one visible page, no continuous scrolling |
| Connectivity | No network, account, cloud service, or online catalog required by the app |

The baseline has no in-book hyperlink activation, interactive table of contents, search, text selection, annotations, dictionary, multiple user bookmarks, cover-grid library, audiobook synchronization, audio seek/previous-track UI, or library editing/deletion UI. Links can be underlined in the book but cannot be followed. AZW3/KF8 and MOBI are future ideas, not supported formats. Complex-script shaping, right-to-left layout, mathematics, tables, and fixed-layout publications are not verified product capabilities. The selected engine build disables HarfBuzz, FriBidi, MathML, SVG, GIF, and WebP support. Do not infer support merely because EPUB can contain those features.

## 2. Product principles and feature inventory

### 2.1 Design principles

1. **Reading first.** Normal reading shows the book and a very low-profile progress bar. Metadata, settings, audio details, and battery percentage belong in the popup.
2. **Remember meaningful location.** Persist a text anchor for each book, independently of pagination and caches.
3. **Predictable actions.** Clamp bounded settings and navigation; wrap themes. Do not let a press act in two screen contexts.
4. **Explicit playback.** Music never starts because a book, application, or catalog finished loading.
5. **Responsive foreground.** Loading, indexing, pagination, decoding, and saving must not monopolize input handling.
6. **Durable progress over rebuildable work.** A bookmark matters more than a catalog cache or prefetched image, especially at low power.
7. **Honest state reporting.** Distinguish unknown battery from empty battery, submitted shutdown from observed power-down, and queued save from acknowledged save.
8. **User data outlives the firmware.** Keep settings and reading state in an appropriate persistent user-data location.

### 2.2 Default experience

| Setting or state | Fresh default |
|---|---|
| Startup screen | Books List |
| Theme | `dark` |
| Reader font | `medium` |
| Music repeat | `ALL` |
| Volume | 50% of the selected output control's raw range, subject to quantization |
| Book/music directories | Platform-provided user content directories; configurable |
| Playback | Stopped |
| Unknown book progress | Unknown internally; displayed as `0%` and grouped Unread |
| Finished status | False |
| Reader popup selection | Back to book list |
| Library menu selection | Rescan library |

### 2.3 Complete feature inventory

- Nonrecursive EPUB discovery, metadata extraction without full pagination, cache reuse, deterministic sorting, per-file errors, manual rescan.
- Reading → Unread → Read grouping, progress labels, sticky finished checkmarks, persistent selection and list viewport.
- Directory-only choosers for books and music; books change immediately, music catalog changes next launch.
- EPUB reflow, embedded raster images, three app-controlled font presets, six app-controlled palettes.
- Previous/next page through either of two equivalent control pairs, clamped at endpoints.
- Popup book information, font and repeat adjustment, return to library, application exit.
- Percentage slider with exact layout-derived page previews, explicit commit/cancel, and no background navigation while previewing.
- Independent per-book anchors, rename recognition, duplicate-content state sharing, safe startup resume.
- Startup-only MP3 catalog, shuffled cycles, start/pause/resume, one skip per hold, ALL/ONE/STOP natural-end behavior, invalid-track exclusion.
- Subtle sound only for actual user-driven book selection changes.
- Saved output volume integrated with the platform's existing volume ownership.
- Battery/source/external-power reporting, static low-battery border, acknowledged low-power save/list transition, guarded critical shutdown where supported.
- Global save/exit across screens, overlays, loading, pagination, and playback.
- Atomic, versioned state; migration of the older reader slice; observable save and recovery errors.

## 3. Logical architecture and ownership

### 3.1 Modules

```text
Application controller
  ├── Input interpreter and screen/overlay state
  ├── Library catalog and selection model
  ├── Reader service
  │     ├── EPUB inspection, content fingerprinting
  │     ├── Layout, page rendering, text anchors
  │     └── Document cache and neighboring page images
  ├── Interface compositor and themes
  ├── Music service
  │     ├── Startup catalog and shuffle model
  │     └── Decoder, PCM buffer, output callback, chirp
  ├── State store and serialized writer
  ├── Pure power policy
  └── Platform adapters
        ├── Display, controls, lifecycle clock
        ├── Filesystem and durable replacement
        ├── Audio output and volume
        └── Power observation and normal shutdown
```

The controller owns user-visible state and decides when a result becomes authoritative. Rendering, audio, and persistence services do not independently change the active screen or resume target.

### 3.2 Execution ownership

| Execution context | Responsibility |
|---|---|
| Main/UI context | Input, model mutation, screen/overlay transitions, completed-result acceptance, playlist decisions, composition, exit coordination |
| Reader execution context | All EPUB-engine access, directory batches, metadata inspection, opening/layout/rendering, engine caches |
| Storage writer | Serialized state replacement and rebuildable catalog writes |
| Music scanner | One cancellable directory traversal per application launch |
| Audio decoder | MP3 open/decode/format conversion and PCM production |
| Audio callback | Bounded PCM consumption, silence, saturating chirp mix |
| Power observer | Potentially blocking platform power reads and snapshot publication |

The reference reader uses one replaceable child process, not a shared engine on the UI thread. CRengine cannot reliably cancel a load or layout, so the parent can terminate the child without waiting for engine cooperation. A port may use a cancellable thread/task or service instead, provided cancellation and result isolation remain reliable.

### 3.3 Asynchronous request contract

Reader requests have a command, arguments, request ID, and generation. Commands include Open, relative Turn, absolute Page, Font, Theme, Restore, directory List/NextBatch, metadata Inspect, and Close.

Results distinguish:

- Progress: stage and percentage, not a completed readable page.
- Directory batch: entries plus a `more` flag.
- Metadata inspection: an entry with identity/metadata or error.
- Completed page: page image and its identity, location, layout, navigation map, and diagnostic information.
- Failure: command-associated error, with no successful replacement page.

Accept a result only for the active request/generation. Back, changing folders/books, failed indexing recovery, and cancellation invalidate obsolete work. A late result must never resurrect a closed book, overwrite another book's anchor, or restart audio.

Only one foreground reader request is accepted at a time. Repeated turns/font/theme/jump requests while busy are ignored rather than accumulated. Overlays and exit remain responsive; music controls remain available when a page already exists.

The reference transport is a nonblocking framed local socket with a 2 MiB frame bound, validated metadata, and an optional fixed-size page image. The wire representation is an internal implementation detail, not a cross-platform file format.

### 3.4 Work priority

1. Observe and process power transitions and any critical-save/shutdown state.
2. Honor global quit and active modal/overlay input.
3. Keep audio terminal events and input responsive during reader work.
4. Perform explicit foreground reader operations.
5. Perform library enumeration and one-file metadata inspection while in the library.
6. Publish requested pages before doing optional neighbor prefetch.

Indexing pauses while reading. Critical writes run ahead of queued catalog work, although they cannot interrupt a filesystem operation already active in the writer.

## 4. Core domain model and invariants

### 4.1 Entities

| Entity | Essential fields and meaning |
|---|---|
| Config | Global theme/font, books/music paths, repeat mode, normalized volume and optional exact mixer snapshot |
| Session | List/reader mode; resume identity/path; selected path/identity/index; top visible path |
| BookState | Content identity, last path, authoritative text anchor, title/author, progress, derived page/count/font/layout key, sticky finished flag |
| LibraryEntry | Path, filesystem signature, optional identity, display title/author, inspection flag/error, progress, finished flag |
| CompletedPage | Image, identity/path, authoritative anchor, page-start anchor, page/count/progress, font/theme, layout key, 101 percentage targets |
| MusicCatalog | Immutable sorted candidate paths, scan state/error |
| MusicSession | Active-book flag, requested Stopped/Playing/Paused state, shuffle cursor, selected catalog index, decoder generation |
| PowerSnapshot | Optional percentage/voltage, native/estimated source, external-power state, charge status, sequence, monotonic sample time, profile/error |
| CriticalCheckpoint | Captured optional book + list session + config, ticket, pending/succeeded/failed result, attempt count/error |

### 4.2 Identity and location are separate

- A **library entry** is a path. Two identical files at different paths remain two visible entries.
- A **book** is its complete-content fingerprint. Identical copies share progress, anchor, and completion.
- A **filesystem signature** is a fast change detector, not a book identity.
- A **text anchor** identifies document content independently of the current font and viewport.
- A **page index** identifies an exact page in one layout, including a page with no text.
- A **layout key** identifies the pagination inputs and engine/resource versions.

Never use title, filename, library row number, rounded percentage, or cached page number as the authoritative bookmark.

### 4.3 Units and conventions

- Engine page indices are zero-based; displayed page numbers are one-based.
- Stored progress is an integer in **0–10000**, where 10000 means 100%.
- Unknown stored progress is **−1**, distinct from 0.
- Slider targets are integer percentage points **0–100**.
- Theme and font names are stable persistence values; numeric indices are internal.
- Original paths and metadata remain UTF-8. Bitmap UI transliteration does not alter stored strings.
- Timing uses monotonic elapsed time. Battery freshness must include time spent suspended.

### 4.4 Essential invariants

1. The last successfully accepted page is the only source for new reading-position state.
2. An unfinished job or uncommitted slider preview never becomes a bookmark.
3. A font change retains the original text anchor until deliberate page navigation replaces it.
4. Theme changes do not change pagination or the text anchor.
5. Prefetch cannot change the engine's exact current page, even on an exception.
6. A reader resume session is not durably advanced past a failed book checkpoint.
7. Finished status is sticky; current-position grouping is calculated independently.
8. A new book session always starts with music stopped.
9. Audio events and PCM belong to their active generation only.
10. Unknown/stale/conflicting power information cannot initiate automatic closure or shutdown.

## 5. Application lifecycle and screen state machine

### 5.1 Screens and overlays

The main screens are **Library**, **Opening**, **Reader**, and **FolderChooser**. The Library has an optional settings menu. The Reader/Opening view has an exclusive overlay state: **None**, **Menu**, or **Jump**. A low-power modal supersedes ordinary screen actions.

```text
Start ── no reader session ────────────────> Library
  └──── reader session / explicit book ──> Opening

Library ── open selected book ────────────> Opening
Opening ── successful page ───────────────> Reader
Opening ── failure / Back ────────────────> Library
Reader  ── Back to book list ─────────────> Library
Library ── folder action ────────────────> FolderChooser
FolderChooser ── use/cancel ─────────────> Library

Reader ── menu/jump ──> Reader + one overlay
Any screen ── quit ──> save completed state, stop services, exit
Reading/opening ── confirmed low power ──> Library + low-power modal
Any screen ── confirmed critical power ──> save/list + shutdown preparation
```

Overlays are transient presentation state. They are not saved as startup session modes.

### 5.2 Startup sequence

1. Resolve package assets, writable state root, and fresh content-directory defaults.
2. Create the state root, initialize logs, load/migrate config and session independently.
3. Apply explicit launch overrides. Books/music folder overrides become saved settings.
4. Start the reader service and platform display/input.
5. Restore the selected volume control once where this platform owns restoration, before audible feedback.
6. Initialize audio and capture the configured music directory for the one startup scan.
7. Start power observation and a capability-appropriate shutdown backend.
8. Open an explicitly supplied book if present; otherwise resume a valid reader session; otherwise scan the library.

An explicit book launch may point outside the configured library. It uses the same identity/bookmark/session rules. Returning to the list still shows the configured books directory.

### 5.3 Open and resume

Opening captures the intended path separately from the last displayed book. Stop/discard any old music session, checkpoint completed reading state, cancel obsolete work, and show the Opening view.

Do not publish a reader session merely because loading started. Wait for a successful page and verified identity. Reopening waits for pending storage work to settle before the engine reads saved position data.

For automatic resume:

1. Try the saved path, fingerprint the actual file, and require the expected identity.
2. If unavailable or replaced, scan/index the configured library for another path with the same content identity.
3. Try a matching renamed/moved copy if found.
4. Otherwise show an informative list notice and retain the independent book record.

A different book occupying the saved path must not inherit the old anchor or silently satisfy resume. Explicit library interaction takes precedence over an automatic recovery search.

### 5.4 Successful reader result

On a matching successful result:

- Replace the displayed page and its derived location data together.
- On Opening → Reader only, create a new stopped music session.
- Adopt a confirmed font/theme result into global preferences and persist changes.
- Load/merge the book record by actual identity; update path, anchor, metadata, layout, and progress.
- Apply deliberate-navigation completion rules.
- Update all matching catalog copies and preserve selection.
- Set in-memory session mode to reader and mark the position dirty for debounced persistence.

### 5.5 Return to list

Back works during initial opening and page/font/jump work. It:

- Stops and invalidates music immediately.
- Captures the last completed anchor, if any; it does not wait for a new page.
- Records a list session and selection/viewport.
- Cancels/invalidates reader work and releases the open document.
- Shows the list and starts its normal scan/cache reconciliation.

The selected book stays selected even when its updated title/progress changes its sorted row.

### 5.6 Normal quit and lifecycle interruptions

Global quit is available everywhere. Stop music, capture the final observed volume, save the last completed book/session/config, cancel reader work, and close services in dependency order. The audio/scanner lifetimes end before the platform audio system is destroyed.

Exiting while successfully reading records reader resume. Exiting from Library or FolderChooser records a list session. An unfinished open never establishes a new successful reader target. Returning to list explicitly records list mode rather than retaining reader resume.

Window-close and normal process termination requests use the same ordinary quit path where available. Sudden power loss cannot run this path; atomic files and checkpoints are the protection in that case.

Focus loss clears held inputs. A reference main-loop gap over **1.5 seconds** also clears held inputs, invalidates power confirmations, resets voltage smoothing, and requests a fresh observation. Existing reading location and slider preview remain unchanged. Music's playing/paused intent remains an in-memory session state; platform audio restoration after suspend must honor it without inventing a new start.

## 6. Semantic input and arbitration

### 6.1 Abstract controls

Implement these semantic controls, mapping physical buttons, keyboard keys, touch controls, or UI commands to them:

| Semantic control | Product role |
|---|---|
| Up / Down / Left / Right | Selection, paging, setting adjustment, slider adjustment |
| A | Primary action on a short release; reader music skip on a hold |
| B | Back/cancel for active overlays/chooser |
| X | Reader popup or library menu toggle |
| L1 / R1 | Alternate previous/next page |
| L2 / R2 | Previous/next theme in unobstructed library/reader |
| Select | Open/cancel jump slider |
| Start | Chord participant; no standalone production action |
| Select + Start | Global save/exit, either press order |
| Volume − / + | Platform-owned output-level adjustment |

Y has no production action. A port does not need unused physical controls, but all active product actions must remain reachable. Help labels should reflect the actual platform bindings.

### 6.2 Timing rules

- Directional selection begins immediately on keydown.
- Only Up/Down repeat: first repeat after **350 ms**, subsequent repeats every **80 ms**.
- Left/Right, shoulders, and overlay toggles act once per physical press.
- Reject duplicate keydowns from operating-system/firmware repeat.
- A short action occurs on release if held less than **600 ms**.
- At **600 ms**, fire one long-A action and suppress the release action. If no timer tick occurred first, a release at or beyond the threshold still counts as long A.
- A hold never repeatedly skips or repeatedly activates a menu item.
- Timing arithmetic must survive counter wraparound.

### 6.3 Dispatch rules

Global quit wins over every ordinary overlay and screen action. The low-power modal consumes ordinary actions before the underlying library. Otherwise the active overlay consumes input before the current screen. Reader-busy filtering is applied after actions that remain available while busy.

Every screen or overlay transition consumes pending A and directional-repeat state. Require a fresh press in the destination context. In particular:

- A that opens a book must not start music.
- A that confirms a jump must not toggle playback.
- Dismissing a low-battery message must not open a book.
- A long press followed by release must not also activate a short action.
- A held direction must not continue into a newly opened menu.
- Jump → Menu is a transition even though both are overlays.

The quit chord can be detected after its first component has already produced a Select action. Its final outcome still takes priority and saves only committed state.

## 7. Library, indexing, and folder settings

### 7.1 Discovery

Scan the selected books directory **nonrecursively**. Match `.epub` case-insensitively. Include regular files and symlinks resolving to regular files; exclude directories, broken links, and other extensions. Spaces and UTF-8 paths are ordinary paths.

Scan at application startup when entering the list, on returning from a book, after a books-folder change, and on explicit Rescan library. There is no filesystem watcher or automatic recursive traversal.

Use the metadata title when nonempty, otherwise the filename without its `.epub` suffix. Keep malformed or unreadable discovered books visible with an error so they can be identified and retried. Metadata-only success is not proof that a complete reading spine is valid.

### 7.2 Incremental indexing and cache

Enumerate in bounded batches, displaying available entries and filename fallbacks while metadata arrives. Reference batches examine at most 128 directory entries and return at most 64 candidates. After enumeration, inspect one uncached file per job.

For each path, cache:

- Filesystem signature: device/inode, size, modification time, and change time, with available subsecond precision.
- Full-content identity.
- Metadata and extractor version.
- Inspection completion/error status.

Reuse a matching signature and extractor version without rehashing/paginating. Refresh progress/finished information from durable book state rather than trusting an old metadata cache. A full reading open always revalidates the content fingerprint.

Compare signatures before/after inspection or full open. A changed-during-read observation is not a valid stable result; report it and allow rescan/retry.

A successful enumeration removes paths no longer present from the visible list, while leaving durable book records intact. A failed or interrupted enumeration must not treat all unseen entries as deleted. An invalid derived cache is rebuilt. Explicit Rescan library retries cached inspection failures; ordinary scans do not automatically loop on the same failed signature.

Background index jobs have a reference **30-second watchdog**. A timeout records a per-entry/index error, replaces the worker, and permits continued use or explicit rescan. Reader opening is cancellable through Back/exit rather than this indexing watchdog.

### 7.3 Ordering and progress labels

Determine group rank from raw current progress, not rounded labels or `finished`:

| Rank | Group | Rule |
|---|---|---|
| 0 | Reading | `0 < progress < 10000` |
| 1 | Unread | `progress == 0` or unknown `−1` |
| 2 | Read | `progress == 10000` |

Sort entries by `(group rank, ASCII-case-folded title, filename, full path)`. Case folding is locale-independent ASCII folding; original UTF-8 strings are retained. Filename/path tie-breakers are deterministic. Groups are contiguous; the baseline does not add section-heading rows.

Display `0%` for unknown/zero progress, `<1%` for raw 1–99, and otherwise `floor(progress / 100)%`. Completion is shown separately as a bitmap checkmark. A finished book revisited at 40% belongs in Reading and retains its checkmark. A one-page book can be at 100% without yet being marked finished.

### 7.4 List presentation and movement

Each row shows title, progress, and a finished checkmark; an error `!` is shown when unfinished and errored. The selected filename and status/error are shown below the list. The header shows current theme and the font preset **read-only**.

| Input | Effect |
|---|---|
| Up / Down | Move one entry; clamp at first/last; hold repeats |
| Left / Right | Move backward/forward by one visible page of entries |
| Left / Right when all entries fit | Select first/last entry |
| Short A | Open selected entry |
| X | Open library menu |
| L2 / R2 | Previous/next theme, wrapping through six palettes |

The reference viewport has **17 rows**. For a differently sized port, derive one shared visible-row count for rendering, navigation, and scrolling. A thin scrollbar appears only when the list overflows. Empty/unavailable/scanning states show explicit status and a hint to choose a folder or rescan. A with no selected entry does nothing.

Play one navigation chirp only when user navigation actually changes the selected book. Do not chirp at a clamped boundary, on empty lists, in menus/choosers, during metadata-driven sorting, on selection restoration, or when grouping changes automatically.

### 7.5 Selection and viewport preservation

Preserve selected path first. If it disappeared, follow the selected content identity to a matching renamed entry. With multiple copies, prefer the previous path if still present; otherwise use the first deterministic identity match. If no match exists, clamp the previous selected index into the new list.

Preserve the top visible path where possible, clamp the viewport, and adjust it enough to keep selection visible. Carry path/identity/index/top-path through sorting, indexing, reader/list transitions, and restart. Automatic reorder is silent.

### 7.6 Library menu

X toggles the menu and opening it selects the first row:

1. Rescan library.
2. Books folder.
3. Music folder.
4. Exit application.

Up/Down selects with clamping; short A activates; B/X closes. Other ordinary controls are consumed, including theme shoulders. The menu uses the current palette, a highlighted row, and concise button hints.

### 7.7 Folder chooser

The chooser displays directories only, with these leading rows:

1. `[ USE THIS FOLDER ]`
2. `../`
3. Sorted subdirectories.

Start from the currently configured path. Sort subdirectories by ASCII-folded name and path. Up/Down selects; Left/Right moves one visible page; short A uses the current folder, navigates to parent, or enters a subdirectory. B cancels without changing the setting. Global quit remains available. Directory enumeration is asynchronous and errors are visible; an unavailable current directory cannot be selected, but parent navigation remains possible.

Save an absolute selected path. Changing the books path starts a new library scan. Changing music saves the path, returns to the list, and shows **Restart to apply music folder**. The current run keeps its original music catalog. There is no path text editor, file picker for individual songs, or folder creation operation.

## 8. EPUB layout, rendering, and reading position

### 8.1 Package processing

Use an EPUB-capable engine that resolves `META-INF/container.xml`, the package document, manifest resources, spine reading order, and relative resource paths. Manifest order must not replace spine order. EPUB 2 NCX and EPUB 3 navigation documents may be present without becoming an interactive navigation UI.

Reject non-EPUB, unreadable, malformed, or protected content through an error path. A parser-generated error document must never be published as a successfully opened book or saved as its reading position.

### 8.2 Typography and layout policy

- Single visible page; no engine header/footer and no separate synthetic cover display. A cover/title illustration included in the publication's reading spine can still render as ordinary book content.
- Use bundled **DejaVu Serif 2.37** regular, bold, italic, and bold-italic faces for the reference look.
- Font presets are global, in order **small → medium → large**; medium initially.
- Embedded publication styles are enabled, with the reader stylesheet enforcing the selected family, core body size, and theme colors.
- Embedded fonts are disabled. The user cannot select arbitrary fonts or extra sizes.
- Hyphenation is disabled; the baseline uses built-in English line breaking.
- Body text is justified, with 115% line spacing, paragraph indentation, and restrained block spacing.
- Preserve meaningful emphasis and structure instead of flattening EPUB to plain text.
- Publication backgrounds are transparent and foreground text follows the app theme. Raster image colors are not theme-tinted or inverted.

**Reference geometry:** square-pixel engine viewport 640×478, left/right margins 16, top/bottom margins 12, font sizes 24/28/32, render DPI 192, and font-size scaling with DPI disabled. At the 320×240 logical reference scale these are approximately 12/14/16-size text, 8 horizontal and 6 vertical margin units. The two reserved native progress rows are outside the page viewport. A normal square-pixel port should choose equivalent visual dimensions without copying the original non-square-pixel transform.

### 8.3 Exact stylesheet policy

The following is the complete application stylesheet in 0.5.8. It defines the reference behavior for a replacement layout engine as well as for a direct port:

```css
* { font-family: "DejaVu Serif" !important; color: inherit !important; background-color: transparent !important; }
body { display: block; margin: 0 !important; padding: 0 !important; font-size: 1em !important; line-height: 115% !important; text-align: justify; }
DocFragment { page-break-before: always; }
p, div, section, article { font-size: 1em !important; }
p { display: block; margin: 0 0 0.25em; text-indent: 1.2em; }
h1, h2, h3, h4, h5, h6 { display: block; font-weight: bold; text-indent: 0; text-align: left; margin: 0.7em 0 0.5em; page-break-after: avoid; }
h1 { font-size: 150% !important; }
h2 { font-size: 140% !important; }
h3 { font-size: 130% !important; }
h4, h5, h6 { font-size: 110% !important; }
em, i { font-style: italic; }
strong, b { font-weight: bold; }
blockquote { display: block; margin: 0.5em 1em 0.5em 2em; text-indent: 0; }
ul, ol { display: block; margin: 0.4em 0 0.4em 1em; }
li { display: list-item; text-indent: 0; }
ol { list-style-type: decimal; }
ul { list-style-type: disc; }
br { display: inline; }
img { max-width: 100%; max-height: 90%; }
a[href] { text-decoration: underline; }
pre { display: block; white-space: pre-wrap; font-size: 85%; text-align: left; }
sup, sub { font-size: 70%; }
sup { vertical-align: super; }
sub { vertical-align: sub; }
```

`DocFragment` is the reference engine's chapter-fragment element. Preserve the intended chapter page break if another engine uses a different internal representation. Book CSS still contributes structure and compatible presentation; the app is not claiming browser-complete CSS fidelity.

### 8.4 Sequential navigation

Left/L1 requests one previous page. Right/R1 requests one next page. Clamp to `[0, pageCount−1]`; no wrapping. On a successful move to a different page, set the authoritative anchor from the destination page bookmark. A clamped turn retains the location but remains a meaningful deliberate command for completion tracking.

Do not skip a legitimate blank page. It appears once in each traversal direction, and another turn advances normally. A theme redraw on a blank page must retain its exact page index.

### 8.5 Anchors, reflow, and the 0.5.8 distinction

The reference persists serialized CRengine **XPointer** text positions. Restore the page containing that anchor when opening or reflowing. On an invalid saved anchor, report a warning and open at the beginning rather than making the book unusable.

There are two different locations in a completed page:

- **Authoritative anchor:** the stable text location to save and retain through font changes.
- **Page-start anchor:** the engine bookmark describing the currently rendered page's start.

They may differ after a font change. Do not replace the authoritative anchor with each newly reflowed page start; otherwise small/medium/large cycles drift through the book. Deliberate page turns/jumps establish a new authoritative location.

**Critical 0.5.8 rule:** temporary rendering/prefetch navigation must restore the exact layout page index, not restore by text anchor. An empty page's fallback XPointer may resolve to an earlier page. Restoring that bookmark after every prefetch caused a forward-navigation loop before 0.5.8. Save the current page index, render neighbors, and restore the index on both success and failure, leaving the authoritative anchor untouched.

Text anchors still govern cross-session resume and re-pagination. Consequently the baseline does not guarantee that an ambiguous blank page resumes as that exact empty layout page after restart; its reliable exact-page guarantee applies to live page navigation, theme redraw, and temporary cache work within the layout.

### 8.6 Progress and completion

Progress describes the displayed page's **end position** in document-height space, clamped to 0–10000. The final page is explicitly 10000, including a one-page document. It is not simply `pageIndex / pageCount`, so a first page can already show nonzero progress.

Sticky completion is set only when a successful deliberate command satisfies:

```text
on final page AND (
    command is forward Turn
    OR command is absolute Page and pageCount > 1
)
```

Thus a multi-page book is finished after forward navigation to the final page or a committed final-page slider jump. A one-page book is finished only after a forward-turn attempt. Opening/resuming at the end, previewing 100%, theme redraw, and font re-pagination do not establish completion by themselves.

Once true, finished remains true through backward reading, font changes, reopen, and restart. There is no user-facing reset-finished command.

### 8.7 Layout and image caches

The reference has:

- An engine-managed **64 MiB** document/layout cache on disk, shared across lazily created font/layout variants.
- A bounded in-memory neighborhood of current/previous/next page images.
- Optional prefetch of next then previous page after publishing the requested page.

Cache keys include content identity, engine revision, stylesheet hash/version, font-face content identities, font preset, viewport, DPI, margins, line spacing, embedded-style/font and line-breaking choices, and rendering adaptations. Theme is excluded from pagination identity; changing theme invalidates colored page images only.

The reference layout resource identity explicitly includes `layout-v1`, `dynamic-color-v1`, and `portable-jpeg-v1`. A change affecting layout/render compatibility needs an appropriate new cache identity. Cache corruption or absence causes rebuilding, not loss of the independently stored anchor. Page-cache eviction and prefetch are optional optimizations; observable navigation must be identical without them.

## 9. Reader popup and jump slider

### 9.1 Normal reader and busy behavior

The unobstructed reader shows content and progress, plus the low-battery frame if applicable. X opens the popup. Select opens the jump slider only when a successful page exists and the reader worker is idle. B by itself does not leave the unobstructed reader.

During initial opening, page turns, jumps, and pagination, ignore additional reader navigation/font/theme requests. X, menu navigation/close, Back, repeat adjustment, and quit remain responsive. Fresh A presses can toggle/skip music during page/font/jump work once a completed page exists; initial opening has no music session to control.

Keep the old completed page visible until a replacement succeeds. A failed request retains that page/anchor and shows an error, normally opening the popup for recovery.

### 9.2 Popup contents

The translucent top information panel shows:

- Application version/milestone label in the reference build.
- Book title.
- Author, empty if unavailable.
- Filename.
- `PAGE n / total` and current theme.
- Music scan/playback state and candidate track number/count.
- Battery percentage/source and power/charge status.

The four action rows are:

| Row | Interaction |
|---|---|
| Back to book list | Short A returns to list, including during reader work |
| Font size | Left/Right decreases/increases small → medium → large; clamped |
| Music Repeat | Left/Right changes ALL → ONE → STOP; clamped |
| Exit application | Short A saves/exits |

Opening the popup selects Back. Up/Down changes the highlighted row with clamping. A on Font size or Music Repeat is consumed without changing it. B/X closes. Select, page-turn shoulders, theme shoulders, long A, and other inactive inputs are consumed by the popup.

Apply an accepted font adjustment immediately through a reader job, preserving the authoritative anchor and keeping the popup open on Font size. Ignore further font changes until the result arrives; persist the confirmed result, not an uncompleted request. Repeat adjustment needs no reader job and remains available during pagination; it does not change the current track/playback state.

### 9.3 Slider opening state

Capture the completed page's identity, layout key, anchor, exact page index, page count, and percentage map. The menu and slider are mutually exclusive.

Initialize target percentage as follows, testing final page first:

```text
if current page is final: 100
else if current page is first: 0
else: clamp(floor(progress / 100), 1, 99)
```

At this opening percentage, the target is the exact original page, even if the normal percentage map would select another page. Returning to that opening percentage restores this exact-origin interpretation. A one-page book opens at 100%, and every possible target maps to its only page.

### 9.4 Slider controls

| Input | Effect |
|---|---|
| Left / Right | Target −1 / +1 percentage point |
| Up / Down | Target +10 / −10 percentage points; holds repeat |
| Short A | Commit displayed target page |
| B / Select | Cancel, retaining exact original page and anchor |
| X | Cancel and open popup with Back selected |
| Long A / shoulders / Y / Start alone | Consume without navigation, music, or theme changes |

Clamp target to 0–100. Show `JUMP TO: n%`, one-based `PAGE n / total`, a track with target marker, and control hints. The underlying page and reading-progress bar remain at the origin during preview. Previewing the end never marks completion.

### 9.5 Layout-derived preview mapping

Build an ordered 101-entry map once per completed layout:

```text
for percent = 0..100:
    y = floor(fullDocumentHeight * percent / 100)  // wide arithmetic
    targets[percent] = clamp(nearestLayoutPage(y), 0, pageCount - 1)
targets[0] = 0
targets[100] = pageCount - 1
```

Use the same document-position/page mapping as actual engine navigation. Validate size, endpoints, bounds, and monotonicity. Rebuild on open/re-pagination and retain across theme redraw. Building the map must not navigate the live document or change its anchor.

Slider movement reads this map locally; it performs no render, prefetch, or bookmark write. Several percentages may name the same page. A uniform `percent * pageCount / 100` approximation is insufficient for uneven chapter/page heights.

### 9.6 Confirmation and cancellation

Before commit, verify captured identity/layout/anchor/page/count still match the displayed page. If the chosen page already equals the current page, close without a reader request or anchor change. Otherwise submit exactly one absolute-page request and close only after submission succeeds.

The old page stays visible during the job. On success, checkpoint the **returned** anchor/progress and apply normal completion. Its actual percentage may differ from the requested percentage because it names a containing page. On failure, preserve the old location and provide popup recovery.

Cancel, switching to menu, Back/exit during a preview, and restart never save an uncommitted target. Back/exit during an accepted but unfinished jump saves the last completed page, invalidating the late jump result.

## 10. Visual design and composition

### 10.1 Visual hierarchy

- Flat, compact, high-contrast bitmap controls surround a serif reading page.
- Normal reading has no permanent toolbar, title, clock, music widget, page label, or numeric battery field.
- Menus have clear selected-row outlines/arrows and terse in-context help.
- Progress is low contrast and unobtrusive; warning red is an intentional exception.
- Library and folder screens use the active palette throughout.
- Preserve readable text and the same information hierarchy when adapting to a different aspect ratio or input system.

### 10.2 Six palettes

Colors are RGB hex, without alpha. The stable theme order wraps in both directions:

| Name | Background | Text | Accent | Muted / progress | Panel |
|---|---|---|---|---|---|
| `dark` | `#101419` | `#D8DCE0` | `#92B6B0` | `#444F59` | `#202930` |
| `warm` | `#272019` | `#E5D2B3` | `#C8A16C` | `#655240` | `#3B3025` |
| `amber` | `#1B1006` | `#ED9038` | `#FFA744` | `#714322` | `#352313` |
| `matrix` | `#07140B` | `#8DCC96` | `#A1EAB0` | `#2D5939` | `#142B1B` |
| `light` | `#EEE9DD` | `#292D30` | `#4B746E` | `#C0BBAA` | `#DBD5C7` |
| `warm2` | `#FFD0A0` | `#35271D` | `#9B6333` | `#C39A6A` | `#F1C396` |

Warning red is **`#E03030`** in every palette. Amber and warm2 include accepted warmer-color tuning. These are fixed presets in 0.5.8; there is no user theme editor or YAML theme loader.

### 10.3 UI typography and metadata clipping

The reference UI uses original 5×7 bitmap glyphs, vertically doubled to **5×14 native pixels**, with a six-native-pixel cell advance. Lowercase is displayed as uppercase. This UI font is separate from the Unicode TrueType reader font.

Decode UTF-8 before clipping to cells. Common Latin accents map to base letters; curly quotes to straight quotes; dash variants to `-`; ellipsis to `.`; nonbreaking space to a space; unsupported code points to `?`. `ß` maps to one `S` cell. Newlines become spaces in single-line labels. Keep originals for storage and sorting. This intentionally limited bitmap metadata rendering does not imply that reader text is similarly transliterated.

Reference title cells per list row are 40; general bottom/header lines are about 50–51 cells. Long paths in the folder/header display retain their trailing portion with a leading `...`. Other long lines are clipped. The full filename/status still has its separate line where provided.

### 10.4 Display-independent geometry

Use three explicit concepts: logical layout, rasterization resolution, and final output pixels. Account for the destination's actual pixel aspect ratio and physical readability.

The original panel has 320×480 addressed pixels but a 320×240 logical aspect. The accepted implementation lays out the book at 640×478 square-pixel resolution, averages adjacent horizontal samples into 320 columns, preserves vertical samples, then draws native UI/indicators. Desktop preview doubles native columns to 640×480 for aspect-correct viewing.

A square-pixel display does **not** need that horizontal squeeze. Render directly at an appropriate square-pixel viewport, scaling the reference's logical proportions and font sizes. Preserve the thin final-output progress strip, thin scrollbar, and static warning border at a sensible physical size. For strict reference image matching, use the native measurements below.

### 10.5 Composition order

1. Clear to palette background and draw the completed page if available.
2. Draw the info panel/opening hints when opening or menu-visible.
3. Draw popup or slider, never both.
4. Draw a working/error/status panel in its reserved region.
5. Draw the low-battery frame over reader overlays if a page exists.
6. Draw the reading-progress strip last, so no overlay or frame overwrites it.

Reader panels blend **7/8 panel color + 1/8 underlying pixel** per channel. Library-menu and low-power-modal fills are opaque palette panel color. Selection outlines use accent; the low-power modal outline uses warning red.

Do not let music informational updates create permanent normal-reading chrome. Music detail belongs in popup status space, below higher-priority reader/save notices. An actual reader/save notice or busy state can show a status panel over the page.

### 10.6 Exact reference layout measurements

All coordinates below are **320×480 native reference pixels**, top-left origin. Rectangles use `(x, y, width, height)`.

| Element | Reference placement |
|---|---|
| Reader page | First 478 rows; render viewport 640×478 before horizontal reduction |
| Reader progress | `(0, 478, 320, 2)`; background then muted fill `floor(320 * progress / 10000)` |
| Library header | Text at `(6,10)` and `(6,34)`; separator `(4,56,312,1)` |
| Library/folder rows | 17 rows, text y=`66 + 20*row`; selected rectangle `(3,y−2,312,19)` |
| List title/progress/checkmark | Title x=16, progress x=264; checkmark around x=300–306 |
| Overflow scrollbar | x=318–319, y=64, height=340; accent thumb minimum 4 rows |
| Selected filename/status/help | y=414 / 438 / 460 |
| Library menu | `(12,140,296,188)`; rows y=154/186/218/250; help y=298 |
| Reader information panel | x=4, y=8, width=312, height=170 |
| Information lines | y=18 version, 44 title, 64 author, 86 filename, 110 page/theme, 138 music, 158 battery |
| Reader menu panel | x=4, y=180, width=312, height=210 |
| Reader menu rows | y=194/222/250/278; selected outline `(8,y−6,304,26)` |
| Reader menu help | y=310/332/354/376 |
| Reader busy/status panel | x=4, y=404, width=312, height=64; lines y=412/438 |
| Slider panel | `(4,320,312,148)` with accent outline |
| Slider labels | y=330 target, 352 page, 396/418/440 help |
| Slider track/marker | Track `(14,380,292,2)`; marker width 3, height 14, y=374, x derived from target |
| Slider-associated notice | Separate panel y=270, height=34, line y=280 |
| Low-power modal | `(8,150,304,206)`; title/save/detail/error y=166/196/226/248; help y=280/302/324 |
| Low-battery frame | Top rows 0–1, bottom rows 476–477, side columns 0–1 and 318–319; progress rows remain untouched |

Scrollbar thumb height is `max(4, floor(trackHeight * visibleRows / count))`; its position spans the remaining track in proportion to `top / (count−visibleRows)`.

The frame is static, not blinking. It overlays the page edge without changing layout/margins or the saved anchor. Its reference thickness is two addressed pixels on each side; on the original non-square panel those dimensions do not have equal physical thickness.

## 11. Ambient music and navigation sound

### 11.1 Startup catalog

Capture the music directory after config/migration/launch overrides, and scan it once on an independent cancellable scanner. Discovery is nonrecursive, matches `.mp3` case-insensitively, accepts regular-file symlinks, and skips broken links/directories. Do not decode the whole catalog during scanning.

Sort candidates deterministically by path. Their stable one-based sorted indices are the track numbers shown in the popup; shuffle order is independent. The count includes candidates later found corrupt or missing.

Scan states are Scanning, Ready, Empty, and Failed. A failed enumeration discards incomplete results. Missing/unreadable directories leave reading usable with a clear popup/log explanation. A press while scanning does not queue future playback. No bundled test tone is implicitly added to the production catalog.

New files and changed music-folder settings require an application restart. Rescanning books, opening another book, starting playback, and changing repeat never rescan music.

### 11.2 Session and control semantics

Create a fresh stopped session only when an initial book open succeeds, including automatic reader resume. Page turns, jumps, font changes, and theme redraws keep that session.

| Reader action | Stopped | Playing | Paused |
|---|---|---|---|
| Short A | Fresh shuffle/start if catalog and output ready | Pause, retaining position and playlist | Resume same track/position/playlist |
| Long A | No action | Advance one shuffled track, keep playing | Advance one shuffled track, selected at beginning and already paused |

There is no separate stop button in the unobstructed reader. Back/list, changing/abandoning books, quit, and low-power interruption stop playback, discard the session playlist and queued PCM, and invalidate stale decoder work. The app-wide repeat preference survives.

Music continues under menu/slider overlays and through reader operations. Overlay A always acts on the overlay, never on music. Newly opened/resumed books never autoplay. Track position, current track, shuffle order, and playing/paused state are not persisted across book sessions or restarts.

### 11.3 Shuffle model

- Use a PRNG seeded once per application launch; tests can inject a fixed seed.
- Generate a permutation of all eligible candidates when starting a stopped session.
- Visit each eligible track once per cycle, through natural progression or manual skip.
- Generate a new permutation when the cycle ends.
- With multiple eligible tracks, prevent the first of a new cycle from equaling the last of the preceding cycle; swapping the first two entries is sufficient.
- With one eligible track, repetition is allowed.
- Pause/resume does not reshuffle. ONE-mode replay does not advance the shuffle cursor.

### 11.4 Repeat mode

Repeat is global and persistent, default ALL. It is evaluated when a matching successful natural-Finished event is processed:

| Mode | Successful natural end of track |
|---|---|
| ALL | Advance through the retained shuffle; replenish cycles indefinitely |
| ONE | Restart the same eligible track from its beginning without advancing shuffle position |
| STOP | Stop after its final PCM tail drains; clear transient playback/playlist state |

Changing mode does not start, pause, seek, restart, or regenerate the current track/session. A mode change before an outstanding Finished event is consumed affects that event. Manual long A advances in **every** mode, retaining paused intent. After STOP ends, a short A creates a fresh shuffle session with the same repeat preference.

### 11.5 Failure and race handling

Open/decode failure and zero-decoded-frame EOF are failures, not successful natural ends. Exclude a failed candidate for the remainder of the application run, log it, and advance using the current playing/paused intent. The failed set survives per-book playlist reset; restarting the app retries candidates.

Schedule at most one new decoder attempt per main-loop update. When no eligible tracks remain, settle at Stopped with **No playable tracks; restart to retry**. ONE must not endlessly retry a failed file; STOP applies to successful natural EOF, not to failure recovery.

Keep requested session intent separate from transient backend terminal state. If pause races with EOF, continued/repeated playback must retain paused intent. If skip/stop/end-book races with EOF or decode completion, stale generations cannot publish PCM or advance playback. Paused skip must be one atomic start-paused operation, not start-then-pause with an audible race window.

### 11.6 Output pipeline

The reference uses mpg123 and one SDL output device for both music and chirps:

```text
MP3 file → decoder worker → output-format PCM → bounded ring
                                                   ↓
precomputed navigation chirp ───────────────→ audio callback → device
```

Requested output is 44100 Hz, native-endian signed 16-bit, stereo, 1024 callback frames. Accept negotiated mono/stereo signed 16-bit output at a positive rate and convert MP3s accordingly. A port may use its native audio format while preserving playback behavior.

Reference ring capacity is **32768 interleaved int16 samples** (64 KiB), not 32768 stereo frames. Playback is primed after 4096 samples or EOF. The decoder uses bounded chunks; callback work performs no file access, decode, allocation, logging, playlist decision, or main-thread wait.

The callback consumes available complete frames, emits silence for missing music, mixes the chirp with saturation, and counts underruns excluding ordinary startup/final drain. Natural Finished is published only after all decoded tail PCM is consumed. Manual skip and explicit stop discard old PCM immediately.

Use typed Finished/Failed events, each consumed once, rather than parsing message text or treating any Stopped backend state as EOF. All status, event, and PCM publication is generation-checked.

### 11.7 Popup music information

Representative labels:

- `MUSIC: SCANNING`
- `MUSIC: NO MP3 FILES`
- `MUSIC: FOLDER UNAVAILABLE`
- `MUSIC: UNAVAILABLE` when output initialization fails
- `MUSIC: STOPPED / 24 TRACKS`
- `MUSIC: PLAYING 7/24`
- `MUSIC: PAUSED 7/24`

`7` is the stable catalog index, not shuffle slot 7. Scan/playback failure detail uses the popup's reserved status area and logs. The baseline does not show track titles, progress, or album art in normal reading.

### 11.8 Navigation chirp

The reference synthesizes a quiet **45 ms** warm, descending chirp and restarts that short sound on another actual selection change rather than queueing a backlog. For sample time `t=i/sampleRate`, length `N=floor(sampleRate*0.045)`:

```text
envelope = sin(pi * i / N)^2
sample = 1800 * envelope * sin(2*pi*(660*t - 1300*t*t))
```

Mix the same chirp sample into each output channel with signed-16 saturation. It uses the normal output volume and the same audio subsystem as music; there is no separate sound preference in 0.5.8.

## 12. Volume integration

### 12.1 Product contract

Persist output volume, initially 50%, and restore it once on launch before audible feedback where supported. If the firmware/OS already owns physical volume buttons, observe that result rather than applying another adjustment for the same press.

On a platform where the application must implement volume changes itself, map each user press to exactly one native adjustment and feed the observed result back into persistence. Do not add a second independent volume path on a platform already handling it.

### 12.2 Exact versus normalized restoration

Store normalized percentage plus an optional platform control identifier, raw range, left/right levels, and left/right switches. When control ID/range and saved raw levels remain valid, restore exact channel levels and applicable switches. Otherwise map the normalized percentage into the current range:

```text
raw = minimum + floor((maximum - minimum) * clamp(volume, 0, 100) / 100)
```

Read back/checkpoint the actual quantized result immediately. Reference normalized percentage is derived from the left channel. Use a valid saved control first; reference fallback order is PCM, Master, Headphone, Speaker, then an available playback control. These names are adapter details.

The original device uses firmware-owned `PCM,0`, raw range 0–31, without a playback switch. Those identifiers/ranges are not portable assumptions.

### 12.3 Observation and persistence

Reference polling is every **100 ms**; selected-control changes update live config and debounce its save by **250 ms**. Unrelated mixer changes do not cause unnecessary config writes. Poll/capture once more before normal exit, and capture the newest observation before a low-power transition owns its checkpoint.

Mixer failure and audio-output failure are independent. Lack of a usable mixer must not disable otherwise working audio/reading. Host preview is observation-only by default and does not overwrite saved device mixer settings with a host-card snapshot. Test runs do not restore physical hardware volume.

## 13. Battery observation and low-power behavior

### 13.1 Portable power snapshot

Keep these fields distinct:

- Optional integer percentage, 0–100.
- Source: Native, Estimated, or Unknown.
- Optional voltage and its defined units.
- External power: Battery, Connected, Unknown, or Conflict.
- Charge status: Unknown, Discharging, Charging, Full, or NotCharging.
- Monotonic sample time, distinct sample sequence, hardware profile/error.

External power connection is not proof of measured charging or full state. A missing value is not zero. Prefer a valid native capacity measurement. If only voltage is available, use justified platform bounds/calibration and label the percentage as an estimate.

Malformed or out-of-range reported values produce Unknown rather than a guessed percentage. In the reference observer, a present but invalid native capacity is an error, not permission to substitute a voltage estimate; voltage estimation is used when native capacity is absent. Supply discovery must select a coherent battery/input pair and must not infer battery operation from ambiguous or unrelated power sources.

The reference linear voltage estimate is:

```text
clamp(floor((medianVoltage - minimumDesignVoltage) * 100
            / (maximumDesignVoltage - minimumDesignVoltage)), 0, 100)
```

Use wide arithmetic, valid units, and the supply's actual bounds. The original 3.4–4.2 V kernel-design endpoints are a voltage estimate, not a calibrated state-of-charge curve. Do not transplant them to unrelated batteries.

### 13.2 Observation, smoothing, and freshness

Read power off the UI/audio paths about every **2 seconds**, publishing one bounded latest-snapshot mailbox. Use a clock including suspended time, not wall-clock time or a wrapping UI tick alone.

Reference estimate smoothing uses the rolling median of the last three valid voltages; startup uses available samples (the upper median for two). Reset on profile/cable/charge-state change, invalid data, suspend refresh, clock reversal, or a gap over six seconds. Native capacity is used directly.

A sample is fresh only with a valid sequence, no future timestamp, and age **≤6 seconds**. Count distinct observer samples, not repeated UI ticks reading the same mailbox. Refresh after a suspend/long-loop gap and discard an old in-flight result from before refresh.

Only fresh, valid percentage with confirmed battery operation can initiate automatic actions. Connected external power, Charging, or Full suppress them. Unknown/conflicting power state and invalid/stale percentages cannot initiate closure or shutdown. An already visible warning can remain through a brief stale interval until a new valid observation updates it.

### 13.3 Popup battery labels

Show native percentage directly or an estimated value with `~`, for example:

- `BATTERY: ~64% / ON BATTERY`
- `BATTERY: ~90% / USB POWER`
- `BATTERY: 80% / CHARGING`
- `BATTERY: 100% / FULL`
- `BATTERY: 75% / USB NOT CHARGING`
- `BATTERY: UNKNOWN`, `... / POWER UNKNOWN`, or `... / POWER CONFLICT`
- `BATTERY: STALE / REFRESHING`

Use the destination's meaningful external-power label if it is not USB. Do not invent Charging/Full when the adapter only knows a cable is connected. Original device probes confirmed capacity/status attributes were absent; the production observer therefore reports a marked voltage estimate and USB POWER.

### 13.4 Thresholds and episode latches

| Condition on confirmed battery operation | Effect |
|---|---|
| Percentage **<15%** | Static red page-edge warning frame, including menu/slider views |
| Two successive distinct fresh samples **≤5%** | Once per low episode, interrupt Reader/Opening, checkpoint, stop music, return to list, show modal |
| Two successive distinct fresh samples **≤2%** | From every screen, prepare durable list state and request supported normal shutdown |
| Connected cable | Remove warning, suppress actions, re-arm both episodes |
| Charging/Full | Suppress actions and remove warning; do not infer cable state |
| Unknown/stale/conflict | No new automatic action; invalidate threshold confirmation |

The 2% action has priority over the 5% interruption. Handle startup already below thresholds and jumps such as 16% → 1%; observing the exact boundary is unnecessary.

Latch the 5% episode when interruption begins. Re-arm after two battery samples ≥7%, or confirmed cable power. Unknown data does not re-arm. After dismissing the notification, the user can explicitly reopen at 3–5% without immediate repeated closure. Restart begins a new episode, so a resumed low-battery book may be interrupted again.

Latch an actual critical shutdown attempt once per critical episode. Re-arm after two battery samples ≥4% or cable connection. A prepared but unsubmitted request is cancelled if power becomes connected/unknown/stale or rises above 2%; a fresh reconfirmation can prepare again. An actual attempt remains latched to avoid command loops.

### 13.5 Five-percent interruption

1. Capture the last completed book state, selection/viewport, and current config/volume before clearing any reader state. An initial open has no new anchor; retain prior durable records.
2. Stop/invalidate music; close overlays; cancel reader/index work; consume held A/repeat.
3. Switch to the cached Books List and queue a critical checkpoint in **book → list session → config** order.
4. Show the actual observed percentage in a modal title, even if it is below 5%.
5. Show `SAVING` until explicit acknowledgement; then `POSITION SAVED` or `SAVE FAILED`, with a specific error field.
6. Defer background indexing and new opens while the modal owns the transition.

A/B dismisses only after a success/failure result, and cannot also open a book. The captured checkpoint remains available after failure. One automatic retry is allowed; X on a failed-save modal starts a fresh retry of captured data. Global save/exit remains available. Do not claim that a drained storage queue means the save succeeded.

After a successful interruption checkpoint, restart enters the list; explicitly reopening restores the saved text location. Preserve sticky completion, selected identity, and viewport across the transition.

### 13.6 Critical shutdown

Critical policy runs app-wide: list, settings, chooser, opening, reader, overlays, indexing, page work, font work, and jump work. A global quit cannot downgrade a pending low-battery poweroff to an ordinary exit.

1. Stop music and obsolete work immediately; capture the completed anchor or retained pending Back-to-list checkpoint, selection, and latest config/volume.
2. Promote an existing 5% modal/checkpoint if necessary, keeping captured book data and refreshing config.
3. Prepare book → list session → config with an asynchronous ticket, **five-second preparation budget**, and one automatic retry within that budget.
4. On acknowledged success, proceed. On failure or deadline expiry, display/log `SAVE INCOMPLETE` as appropriate and retain the last atomic durable files; critical energy urgency permits best-effort normal shutdown.
5. Recheck the latest fresh on-battery ≤2% condition immediately before submitting each platform shutdown stage.
6. Request the platform's normal orderly shutdown. Treat unsupported, spawn, permission, nonzero-exit, or timeout outcomes explicitly.

On unsupported/failed shutdown, remain in the stopped Books List with an explanation and working global exit. Do not repeatedly execute the request. A successfully submitted request is not itself proof that hardware powered down.

The reference verified adapter runs fixed `/bin/sync` then `/sbin/poweroff`, without a shell, force flags, or direct reboot syscall, with a two-second response budget per command and a fresh profile/power check before each. Other platforms supply their own authorized orderly-shutdown API. If an OS does not permit app-initiated device shutdown, the supported fallback is the saved/stopped list with explicit unavailability.

Host/smoke/synthetic power tests must use unavailable or recording backends. The original production Y shortcut/test build was retired before this baseline; manual shutdown is not a user feature.

## 14. Durable state, compatibility, and recovery

### 14.1 Storage separation

```text
STATE_ROOT/
  config.json
  session.json
  books/
    <content-identity>.json
  cache/
    library.json
    documents/...
  reader.log
  stderr.log
```

Config, session, and book records are durable user state. Library/document/image caches are rebuildable. Logs are operational diagnostics. Package assets are immutable and resolved relative to the package, not an arbitrary working directory.

Choose a persistent, writable user-data location appropriate to the port. On systems with separate firmware and user-content storage, prefer user storage so firmware replacement does not erase reading history. Do not silently fall back to a volatile location and imply state is durable.

The original device defaults are `/media/sdcard/epubreader`, `/media/sdcard/books`, and `/media/sdcard/music`; host defaults are `$HOME/.epubreader`, `$HOME/books`, and `$HOME/music`. Saved content-folder settings override fresh defaults. Explicit state/assets/content overrides support testing and manual use.

### 14.2 Content identity

For compatibility, compute **XXH3-128**, version label `xxh3-128-v1`, over the entire file bytes, using the standard unseeded algorithm. Serialize the 128-bit digest as 32 lowercase hexadecimal characters: 16-digit high64 followed by 16-digit low64, zero-padded.

Renaming or moving unchanged bytes preserves identity; two identical copies share state. Repacking/editing an EPUB changes its identity even if its prose/title appears identical. A different file at the same path gets a different reading record. Filesystem signature fields accelerate inspection but cannot replace full-open identity verification.

A port choosing another identity scheme needs explicit state migration if existing records are to survive. Likewise an alternative engine needs an anchor translation/import strategy or an explicitly separate state namespace; matching JSON keys alone does not make locations interoperable.

### 14.3 Config schema

All current JSON documents have integer `schema: 1`. Config fields and fresh values:

| Field | Type / default | Meaning |
|---|---|---|
| `theme` | String, `dark` | One of the six stable names |
| `font` | String, `medium` | `small`, `medium`, `large` |
| `books`, `music` | Absolute path strings | Configured content folders |
| `musicRepeat` | String, `all` | `all`, `one`, `stop`; optional for older configs |
| `volume` | Integer, 50 | Normalized 0–100 output volume |
| `mixer` | String, empty | Adapter control ID |
| `minimum`, `maximum` | Integers, 0 | Last control raw range |
| `rawLeft`, `rawRight` | Integers, −1 | Exact levels; −1 initially unavailable |
| `switchLeft`, `switchRight` | Integers, −1 | −1 unknown, 0 off, 1 on |

Example with platform-chosen paths:

```json
{
  "schema": 1,
  "theme": "dark",
  "font": "medium",
  "books": "/user/books",
  "music": "/user/music",
  "musicRepeat": "all",
  "volume": 50,
  "mixer": "",
  "minimum": 0,
  "maximum": 0,
  "rawLeft": -1,
  "rawRight": -1,
  "switchLeft": -1,
  "switchRight": -1
}
```

Missing repeat defaults to ALL. Invalid repeat recovers that preference to ALL with a notice, retaining other valid config. General malformed config uses document-level recovery rather than pretending every arbitrary field was salvaged. Theme/font are global; the per-book last font is derived history, not a per-book font override on open.

### 14.4 Session schema

| Field | Type / initial value |
|---|---|
| `schema` | Integer 1 |
| `mode` | `list` or `reader`; initially `list` |
| `identity`, `path` | Resume book identity/path; initially empty |
| `selectedPath`, `selectedIdentity` | Selected library entry; initially empty |
| `topPath` | Top visible entry path; initially empty |
| `selectedIndex` | Nonnegative fallback index; initially 0 |

Reader mode requires a valid nonempty identity and path. List mode may retain historical book fields; `mode` determines startup behavior. Chooser and overlays are not persisted modes. Resume must verify the file before using the session's identity expectation.

### 14.5 Per-book schema

File: `books/<identity>.json`.

| Field | Type / initial value | Meaning |
|---|---|---|
| `schema` | Integer 1 | Document schema |
| `fingerprint` | `xxh3-128-v1` | Identity algorithm/version |
| `identity` | 32 lowercase hex characters | Must match record filename/requested identity |
| `path` | String | Last known actual path |
| `anchor` | String | Serialized authoritative text location |
| `title`, `author` | Strings | Metadata snapshot |
| `layoutKey` | String | Last derived layout identity |
| `progress` | Integer −1 initially, range −1..10000 | Last known actual position |
| `page`, `pageCount` | Integers 0 initially | Derived zero-based page/count |
| `font` | Stable string, `medium` initially | Last successful layout font |
| `metadataVersion` | Integer 1 | Extractor version |
| `finished` | Boolean false | Sticky completion |

The anchor, identity, and finished state are the important user history. Page/count/progress/layout are useful snapshots that may refresh when the book is opened on another layout. Do not derive the authoritative anchor from those snapshots.

### 14.6 Library cache schema

`cache/library.json` contains `schema: 1`, `extractor: 1`, the absolute `folder`, and `entries`. Each entry contains `path`, `signature`, `identity`, `title`, `author`, `error`, `inspected`, `progress`, and `finished`.

Use only for the matching folder/extractor version. Rebuild on corruption/version mismatch; refresh progress from independent book files. The reference reader permits up to 100000 parsed cached entries and a 32 MiB catalog document; these are defensive cache bounds, not a measured 100000-book usability guarantee.

### 14.7 Validation and recovery

Reference bounds include:

- 64 KiB ordinary JSON state documents; catalog reads allow 32 MiB.
- Path/common metadata strings up to 4096 bytes, without embedded NUL.
- Text anchor up to 16384 bytes.
- Progress −1..10000, volume 0..100, switches −1..1.
- Page/count and selected index bounded to 10000000; metadata version bounded to 1000000.
- Correct JSON types, recognized enum names, valid identity/fingerprint pairing.

Read config, session, and individual book documents independently. A bad session must not discard all book records. Preserve malformed files as `.invalid`, `.invalid.1`, etc. before replacing them with recovered data. Unsupported schemas are reported and left intact; an older writer must refuse to overwrite them. Leftover `.tmp` files are not committed state and are ignored by readers.

For atomic-read consistency, open a file first and size/read that same descriptor, so a concurrent replacement cannot pair one inode's length with another's contents.

### 14.8 Atomic write and save ordering

Use the platform equivalent of:

1. Ensure the destination directory exists.
2. Write the complete document to a same-directory temporary file.
3. Flush the file durably and close it.
4. Atomically replace the destination.
5. Flush directory/metadata durability where required by the filesystem.

Propagate write, close, replacement, and directory-sync errors. Reference permissions are private directories/files (0700/0600). A port may use a transactional database if it provides equivalent visibility, ordering, and acknowledgement semantics.

Serialize writes on one queue. Capture immutable snapshots on the owner context. Coalesce compatible pending writes, use revisions to prevent an obsolete retry/session from replacing newer state, and retain failed current writes for retry. Reference ordinary failed-write retry is approximately every second; errors are surfaced rather than silently forgotten.

Debounce completed position writes by **250 ms**. Save theme/repeat/folder changes promptly and font preference only after a successful result. Explicit Back/quit checkpoints the latest completed location even if the debounce has not expired.

For normal reading checkpoints, commit the book before a corresponding reader session. Critical checkpoints explicitly write optional book, then list session, then config. Atomicity is per file, not a multi-file transaction: interruption between files must remain recoverable. A failed book write must not advance a dependent session.

### 14.9 Critical checkpoint API

Provide an asynchronous ticket with Pending/Succeeded/Failed, attempt count, and specific error. Queue it ahead of pending rebuildable work; preserve its captured data across failure and 5%→2% promotion. A ticket can be retried once automatically. Manual X recovery creates another captured-save attempt.

`queue empty`, `idle`, and `flush returned` are not proof of success because failed writes can have left the queue. The low-power UI and shutdown coordinator must use the explicit result.

The five-second critical deadline bounds **pre-shutdown preparation**, not all filesystem syscalls. The reference ordinary final shutdown/store destructor still flushes its writer, and cannot provide a hard latency bound on a permanently blocked filesystem. A port should not claim the worker-cancellation or critical-preparation bounds make every I/O path hard-real-time.

### 14.10 Migration and path moves

The reference imports older `slice/state.ini` preferences and `slice/books/<identity>.position` bookmarks from within the selected state root. Import only missing production records, retain the legacy files, and make the operation repeatable after interruption. Imported book progress starts unknown, unfinished, until refreshed by a successful open. There is no legacy session, so a fresh production migration starts at the list.

The 0.5.6 change to user-card storage did not automatically move old files. Users copy the old complete state root before first launch at the new location, then select relocated content folders. A port should document its own transfer method and preserve custom saved paths until intentionally changed. Book identity preserves history across content-path moves; it does not locate an absent file without discovery.

## 15. Platform adaptation contracts

### 15.1 Required boundaries

| Adapter | Inputs/outputs and required semantics |
|---|---|
| Display | Correct physical aspect, predictable text scale, completed-frame presentation, final-output indicator composition |
| Input | Physical events → semantic press/release/actions; custom repeat/hold, lifecycle reset, quit reachability |
| Lifecycle/clock | Focus/suspend/resume/quit notifications; elapsed-time clock suitable for freshness across suspend |
| Filesystem | User content enumeration, directory navigation, stable identity reads, durable replacement, error reporting |
| Reader engine | EPUB metadata/layout, exact page navigation, stable content anchors, rendering, progress/map data, cancellation isolation |
| Audio output | Negotiated PCM format, bounded callback/streaming, pause/start-paused, drain/stop semantics |
| Volume | Observe/restore a platform control; exactly one owner per volume adjustment |
| Power source | Typed, timestamped snapshots, units/source/unknown/conflict reporting |
| Shutdown | Capability result and asynchronous normal orderly request with recheck before submission |
| Packaging/assets | Immutable fonts/CSS/resources, writable state separation, source/license notices |

### 15.2 Decisions to make for each port

Record the port's actual choices for:

1. Screen size, pixel aspect, usable viewport, UI scale, and equivalent small/medium/large physical text sizes.
2. Control mapping, action hints, and global exit equivalent. Preserve explicit navigation/confirm/cancel paths if the input system changes.
3. Persistent state and content defaults, removable-storage handling, launch overrides, and folder permissions.
4. Engine choice and the level of anchor/layout compatibility with existing state.
5. Reader cancellation mechanism and asynchronous job/result isolation.
6. Audio backend, buffer budget, output conversion, and suspend recovery.
7. OS/application ownership of volume and whether exact raw restoration is meaningful.
8. Native capacity versus estimated battery data, freshness source, and normal shutdown capability.
9. Packaging/runtime dependency strategy and included notices.

These are implementation decisions needed to realize this design, not additional user settings that 0.5.8 exposes.

### 15.3 Capability-dependent fallback

- No battery hardware/API: show unknown/unavailable; no synthetic 0% or automatic threshold action.
- No device shutdown permission: preserve critical save/stop/list behavior and report shutdown unavailable.
- No mixer interface: retain reading and working audio, using meaningful platform output controls where available.
- No audio output: retain all reader/library features and report music unavailable.
- No persistent document cache: keep reading functional and bookmarks durable; warn if appropriate.

These are supported degraded behaviors. A port can claim full parity only for capabilities its platform actually implements; it should state concrete differences rather than emulate a capability falsely.

### 15.4 Reference launch and evaluation interfaces

These are the current command-line interfaces. A destination may provide equivalent native launch/test mechanisms rather than these exact switch names:

| Interface | Reference purpose |
|---|---|
| `--assets DIR` | Override immutable resource location |
| `--state-dir DIR` | Redirect the complete writable state root, including local legacy import source |
| `--book FILE` or a positional book path | Explicit book open overriding saved startup mode |
| `--books-dir DIR`, `--music-dir DIR` | Override and save content-folder settings |
| `--native-window` | Show raw reference raster geometry instead of aspect-correct desktop preview |
| `--mixer-card CARD` | Select the platform mixer device for diagnostics/manual use |
| `--restore-mixer`, `--observe-only` | Control startup restoration; host defaults to observation-only |
| `--power-fixture DIR` | Inject a sysfs-shaped power tree; real shutdown remains disabled |
| `--smoke-test DIR` | Run the scripted production reader exercise and save native screenshots; requires an explicit book |
| `--help` | Show version, paths, options, and controls |

Normal users configure folders through the in-app chooser. The internal reader-worker executable mode and the separate platform diagnostic are implementation/evaluation facilities, not extra reading features.

## 16. Failure behavior and operational diagnostics

### 16.1 Recovery matrix

| Failure or event | Required outcome |
|---|---|
| Missing/empty books directory | Usable list/menu/chooser, clear status, no crash or fake entries |
| Partial enumeration failure | Preserve already known unseen paths; do not treat failure as mass deletion |
| Malformed EPUB | Visible entry/error; failed open returns to list; no error-document bookmark |
| Metadata-only success but invalid spine | Entry can retain metadata; full open still reports failure |
| Book changes during read | Discard unstable observation; allow rescan/retry |
| Missing/renamed resume path | Search matching identity in configured folder, otherwise list notice |
| Different content replaces path | Separate identity/state; never apply old book anchor to replacement |
| Invalid saved anchor | Warning, open at beginning |
| Page/font/jump failure | Retain completed page/anchor; recover through popup/Back/exit |
| Reader worker dies or returns malformed data | Reject result, retain durable state, expose recovery/list/exit |
| Missing/corrupt cache | Rebuild; reading history remains independent |
| Malformed state | Preserve original, recover affected document, surface error |
| Unsupported state schema | Preserve and refuse older overwrite |
| Save failure | Keep captured/dirty data retryable; do not claim success |
| No MP3s/output/unreadable music folder | Reading remains usable; popup explains state |
| Corrupt/removed MP3 | Exclude for run, bounded advance, stop at exhaustion |
| Stale decoder/reader response | Ignore; cannot alter new session |
| Unknown/stale/conflicting power | Report status; no newly initiated automatic action |
| Shutdown unavailable/fails/times out | Stopped list with save result and distinct capability/command explanation |

### 16.2 Logging

Reference `reader.log` and `stderr.log` are replaced at each ordinary launch. Log useful operational boundaries rather than per-audio-callback output:

- App version, launch paths/options, process context where useful, backend capabilities.
- Library entry count, inspection/cache counts, indexing duration/errors.
- Completed page/count, identity/path, raw progress, font/theme, render time/cache hits, anchor.
- Music catalog outcome, selected stable track index, generation, decode errors.
- Volume restore/observations and setter count, final audio format/underruns.
- Power sample source/time/profile, transitions, captured checkpoint/ticket, attempts/results, deadline expiry, shutdown stages/results.

A diagnostic build/tool may inspect display geometry, physical mappings, audio, mixer, and power profiles. Such tools support port bring-up; their temporary controls are not part of the production reading UI. Synthetic power testing must remain isolated from real shutdown.

### 16.3 Distribution and assets

The user-facing application should be launchable through the platform's normal app mechanism, with icon/name and packaged resources. Resolve resources relative to the installed package; do not depend on a developer working directory. Writable state lives outside read-only package assets.

The reference uses a single self-contained OPK, pinned dependencies, reproducible packaging/checksums, bundled fonts/CSS, and license notices. Equivalent native packaging is appropriate elsewhere. Include only intentionally distributable assets; local personal EPUBs and regression-only media must not enter a release by a broad directory copy.

Existing application code/original assets are GPL-2.0-or-later; bundled third-party components retain their licenses. A port reusing them must carry the relevant source/provenance/notices. Font and dependency versions are part of rendering/build reproducibility, even when the destination packaging differs.

## 17. Responsiveness and resource budgets

Reference constants distinguish observable interaction policy from tunable implementation budgets:

| Value | Reference | Interpretation for a port |
|---|---|---|
| Up/Down repeat | 350 ms delay / 80 ms interval | Preserve interaction timing |
| Long A | 600 ms, once per hold | Preserve interaction timing |
| Position/volume debounce | 250 ms | Preserve prompt checkpoints without a write per event |
| Ordinary save retry | About 1 second | Keep errors observable and retry bounded per update |
| Power sampling / freshness | About 2 s / at most 6 s age | Preserve policy, adapt observation mechanism |
| Suspend/loop-gap refresh | >1.5 s | Reference lifecycle heuristic; use real notifications where available |
| Threshold confirmation | Two distinct fresh samples | Preserve exact policy |
| Critical save preparation | 5 s, one automatic retry | Preserve energy-sensitive ordering/deadline |
| Normal shutdown stage wait | 2 s each in reference backend | Use a bounded native equivalent |
| Index job watchdog | 30 s | Reference guard; tune only with actual platform evidence |
| Reader IPC frame | 2 MiB maximum | Bounded messages; exact transport can change |
| Worker graceful termination | 200 ms before forceful process cleanup | Preserve practical cancellation; mechanism can change |
| Document cache | 64 MiB managed bound | Reference disk budget, tune for destination |
| Page-image neighborhood | Current ±1 page | Bounded cache; avoid layout/anchor side effects |
| Audio ring | 32768 int16 samples | Bounded memory; tune for output rate/latency |
| Library rows | 17 | Reference density; shared derived count on resized UI |

The original plan's cached-turn target of roughly 200 ms is an aspiration, not a universal measured guarantee. Evaluate real-device first-open, cached-turn, pagination, cancellation, audio continuity, and save latency. Keep menus/exit responsive during large-book work and avoid memory/cache growth during sustained reading.

The reference main loop sleeps about 8 ms and redraws on visible state changes instead of continuously repainting an unchanged page. A port may use an event-driven loop. PCM/frame counters alone should not cause normal-reading redraws.

## 18. Port acceptance specification

The following scenarios define a practical near-parity evaluation. Use isolated test state, deterministic inputs/seeds/clocks, original EPUB/MP3 fixtures, and recording shutdown adapters for automation. Actual display, input, volume, suspend, audio continuity, and shutdown capability also require destination-device evaluation.

### 18.1 Library and settings

- Fresh launch opens the list with dark/medium/ALL, no autoplay, and actionable empty/missing-folder behavior.
- Mixed-case EPUB extensions, spaces, Unicode paths, regular symlinks, ignored nested books, broken links, and directories follow the discovery rules.
- Metadata does not require full pagination; malformed candidates remain identifiable.
- Cold and warm scans, changed signatures, explicit failure retry, interrupted enumeration, and cache rebuild behave correctly.
- Raw progress values −1/0/1/99/100/9999/10000 produce correct labels/groups.
- A finished book revisited mid-book keeps its checkmark in Reading; a one-page 100% book is not automatically checked.
- Alphabetical ties are deterministic, including a large mixed catalog (reference tests use 1000 entries).
- Up/Down clamps/repeats, list paging and single-page first/last behavior agree with visible-row count.
- Selection/top path survive title changes, grouping, duplicate copies, rename, removal, Back, and restart without automatic chirps.
- Menu default selection, folder parent/use/cancel, unavailable directory handling, immediate books change, and next-launch music change match the specification.

### 18.2 Reading and navigation

- EPUB 2/3 nested package paths, reversed manifest versus spine, multiple chapters, punctuation, styles, long paragraphs, and relative PNG/JPEG resources render in correct order.
- Every marked prose token appears once and in order across page boundaries; diagnostic extraction uses half-open page-anchor ranges to avoid inclusive-end double counting.
- All three font presets preserve an original mid-book anchor across repeated cycles and restore its containing page after restart.
- Six themes change text/background without changing layout, page count, anchor, or original image colors.
- Previous/next clamps, including one-page forward attempts, follow completion rules.
- Blank pages can be traversed in both directions, including with warm neighbor caches and theme redraw; prefetch exceptions restore the exact current page.
- Independent books keep independent anchors; identical copies share one record; changed file bytes get a new identity.
- Missing/renamed/replaced resume targets, bad anchors, malformed books, failed jobs, Back/exit during work, and stale results cannot corrupt a previous successful position.

### 18.3 Popup, slider, and input

- Popup order/default row, clamped Left/Right font/repeat adjustment, A consumption on settings, busy repeat adjustment, and close/Back/exit work as specified.
- Slider origin is exact; 0/100 endpoints and all 101 previews agree with committed page selection for uneven layouts and one-page books.
- Returning to the opening target is an exact-origin no-op; choosing another percentage naming the same page is also a no-op.
- Preview movement performs no engine job or state write and leaves page/progress unchanged.
- Commit sends one request; cancel/menu/exit preserves origin; successful final-page jump has correct sticky completion.
- Verify short A on release, one 600 ms hold, delayed-release long A, duplicate keydown suppression, wraparound, and 350/80 ms repeat.
- Held A/directions across list/open/reader/menu/slider/modal transitions do not leak actions.
- Global exit works in either chord order during all screens, overlays, indexing, opening, page/font/jump work, and playback.
- Focus/suspend reset held state while retaining reading position/preview and music intent.

### 18.4 Audio and volume

- Catalog is scanned once, deterministically indexed, and handles empty/failed/cancelled traversal without delayed autoplay.
- Every new/resumed book starts stopped; Back/quit/low power stops and discards its playlist/PCM.
- Short A start/pause/resume and playing/paused/stopped long A semantics are exact; paused skip emits no transient audio.
- Shuffle visits eligible candidates once per cycle, avoids boundary repeat when possible, and handles one track.
- ALL/ONE/STOP act after natural tail drain; mode changes while paused/busy/EOF-pending and manual-skip/EOF in both orders use the proper current mode and generation.
- Missing/corrupt/zero-frame tracks are excluded for the run; exhaustion stops without spinning, including ONE mode.
- Mono/stereo and differing sample rates convert correctly; decoder/stop races cannot publish stale PCM or continue an ended session.
- Audio remains smooth during page turns, re-pagination, jumps, saving, and power sampling; underruns and resource use are observable.
- Only actual book-selection movement chirps. One physical volume press makes one adjustment; quantized/raw restoration and final save work without replacing other preferences.

### 18.5 State and power

- Config/session/book roundtrips, interrupted temporary replacement, malformed/future schemas, retry revisions, and idempotent legacy import preserve independent user history.
- Fault-inject book/session/config failures separately; no dependent session is written past a failed book. Critical tickets distinguish failed/drained from succeeded.
- Delayed/failing writer work does not block input while critical preparation waits; priority, one automatic retry, X recovery, and five-second incomplete-save outcome are correct.
- Native/estimated/unknown power, invalid units/bounds, absent attributes, Charging/Full/NotCharging, external connection/conflict, median reset, stale gaps, and suspend refresh are truthful.
- Check strict 15% versus 14%, exact 5%/2%, startup below threshold, and skipped thresholds such as 16→1; repeated UI ticks cannot replace two samples.
- At 5%, completed anchor/list/config are captured, music stops, A/B cannot dismiss while saving or also reopen, and explicit reopen at 3–5% is not repeatedly interrupted.
- Two ≥7% samples re-arm low interruption; two ≥4% samples re-arm critical; cable power re-arms both; unknown does not.
- At 2%, every screen/work context prepares correctly, including 5% promotion and a pending Back checkpoint; global quit retains critical priority.
- Cable insertion, unknown/stale data, or recovery cancels an unsubmitted request; recheck before each shutdown stage catches a change during the preceding stage.
- Unsupported/spawn/permission/exit/timeout outcomes leave a stopped list; one actual attempt per episode prevents loops. Synthetic tests never execute real shutdown.
- After an actual destination-device shutdown/reboot, verify the durable list session, completed anchor, repeat preference, and output volume. Calibrate/evaluate percentage separately from proving shutdown authorization.

### 18.6 Visual and release evaluation

- Inspect library/menu/chooser, normal reading, opening, popup, slider, status, and low-power modal in all six themes.
- Check long title/author/filename, empty author, large page/track counts, UTF-8 clipping, unsupported bitmap glyphs, and all music/power status labels.
- Verify final-output progress and scrollbar thickness, unobstructed normal reading, frame-through-overlay composition, and no slider/status overlap.
- Verify package-relative assets, writable persistent state, dependency/license notices, and an intentional distributable asset list.
- Exercise sustained reading/music, real controls, volume, suspend/resume, and launch/exit on the destination platform; host simulation alone does not establish those capabilities.

## 19. Reference implementation and traceability

### 19.1 Source map

These links identify the implementation used to derive this specification; the behaviors above are stated in full so a reimplementation need not copy those modules.

| Concern | Reference sources |
|---|---|
| Product scope and accepted roadmap | [README.md](README.md), [PLAN.md](PLAN.md), [BRAINSTORM.md](BRAINSTORM.md) |
| Production launch/lifecycle | [src/app/reader_main.cpp](src/app/reader_main.cpp) |
| Screen/session transitions, completion, save timing | [src/app/controller.cpp](src/app/controller.cpp) |
| Pure power confirmation/latches | [src/app/power_policy.cpp](src/app/power_policy.cpp) |
| Semantic controls/timing | [src/platform/input.cpp](src/platform/input.cpp), [docs/CONTROLS.md](docs/CONTROLS.md) |
| Catalog selection, grouping, labels | [src/library/catalog.cpp](src/library/catalog.cpp), [src/library/catalog.hpp](src/library/catalog.hpp) |
| Discovery/cache/signatures/identity | [src/library/scanner.cpp](src/library/scanner.cpp), [src/library/identity.cpp](src/library/identity.cpp) |
| Metadata without pagination | [src/reader/metadata.cpp](src/reader/metadata.cpp) |
| EPUB, anchors, layout, caches, exact-page prefetch | [src/reader/engine.cpp](src/reader/engine.cpp) |
| Reader result and worker isolation | [src/reader/types.hpp](src/reader/types.hpp), [src/reader/worker.cpp](src/reader/worker.cpp) |
| Popup and slider model | [src/ui/reader_controls.cpp](src/ui/reader_controls.cpp), [src/ui/reader_controls.hpp](src/ui/reader_controls.hpp) |
| Production composition | [src/ui/books_list.cpp](src/ui/books_list.cpp), [src/ui/reader_slice.cpp](src/ui/reader_slice.cpp) |
| Palettes, bitmap glyphs, pixel transforms | [src/ui/canvas.cpp](src/ui/canvas.cpp) |
| Reader stylesheet/fonts | [assets/styles/reader.css](assets/styles/reader.css), `assets/fonts/DejaVuSerif*.ttf` |
| Music lifecycle, repeat, shuffle | [src/audio/music.cpp](src/audio/music.cpp), [src/audio/playlist.cpp](src/audio/playlist.cpp) |
| Music scan, PCM/decode/chirp | [src/audio/catalog.cpp](src/audio/catalog.cpp), [src/audio/audio.cpp](src/audio/audio.cpp) |
| Volume | [src/platform/mixer.cpp](src/platform/mixer.cpp) |
| Observation/shutdown capability | [src/platform/power.cpp](src/platform/power.cpp), [docs/POWER-PROFILE-M5.5.md](docs/POWER-PROFILE-M5.5.md) |
| JSON schemas, ordering, tickets, migration | [src/storage/store.cpp](src/storage/store.cpp), [src/storage/store.hpp](src/storage/store.hpp) |
| Atomic replacement and old preferences | [src/storage/state.cpp](src/storage/state.cpp) |
| Builds, adaptations, dependencies | [docs/BUILD.md](docs/BUILD.md), [cmake/CRengine.cmake](cmake/CRengine.cmake), [cmake/CRengineJPEG.cmake](cmake/CRengineJPEG.cmake), [third_party/manifest.json](third_party/manifest.json) |
| License/provenance | [LICENSE.md](LICENSE.md), [third_party/README.md](third_party/README.md), [assets/fonts/LICENSE-DejaVu.txt](assets/fonts/LICENSE-DejaVu.txt) |

### 19.2 Rendering baseline and dependency choices

For the closest engine-level reproduction, the reference uses KOReader CRengine revision **`ab1981c22e4e67cf9d98be3c301736941d2d271c`**, DejaVu **2.37**, xxHash **0.8.3**, and nlohmann/json **3.12.0**. The application is C++17; SDL 1.2 handles original display/input/audio, mpg123 handles MP3s, and ALSA handles original volume observation.

The engine is built headlessly, with FreeType/zlib/PNG/standard RGB JPEG and its own memory manager enabled. Optional Fontconfig/HarfBuzz/FriBidi/libunibreak/UTF8PROC, SVG/GIF/WebP, MathML, Zstd, and unrelated import-helper features are disabled. Two build-time adaptations make theme text color dynamic without re-pagination and make JPEG RGB output portable across the selected libjpeg implementations. These choices explain the baseline's visual behavior and supported-content limits; equivalent native libraries can implement the same contracts.

### 19.3 Evidence and historical boundaries

- [0.5.8 verification](docs/VERIFICATION-0.5.8.md) records the accepted blank-page fix, original failing regression, sequential page-turn tests, and successful host/sanitizer/build/package checks. The fix was accepted on the physical device on 2026-10-17.
- [M3 plan](docs/PLAN-M3.md), [M4 plan](docs/PLAN-M4.md), [M5 plan](docs/PLAN-M5.md), and [M5.5 plan](docs/PLAN-M5.5.md) explain library/persistence, overlays, audio, and power decisions. Their older baseline descriptions are historical, not alternative current behavior.
- [Current device checklist](docs/DEVICE-TEST-M5.5.md), [M5.5 verification](docs/VERIFICATION-M5.5.md), and [accepted shutdown evidence](docs/VERIFICATION-SHUTDOWN-M5.5.md) distinguish implemented policy, user observations, and remaining evaluation items. Battery percentage remains explicitly estimated where no native gauge exists; proof of orderly shutdown is separate from gauge calibration.
- [Fixture documentation](tests/fixtures/README.md) describes original EPUB 2/3, one-page, blank-page, malformed-spine, and short mono/stereo/rate-conversion MP3 specimens. [CMakeLists.txt](CMakeLists.txt) wires the twelve default checks; a locally supplied regression book optionally adds a thirteenth.
- Earlier screenshots in [screenshots/](screenshots/) illustrate the design language, but may show pre-0.5.8 version labels, older popup contents, or earlier grouping. Use the current composition and palette values specified here for implementation.

**Parity criterion:** a destination implementation reproduces the reading, library, overlay, input, audio, persistence, and power-policy outcomes in this document, with its hardware-dependent bindings/capabilities explicitly mapped and its reading positions preserved as document locations rather than assumed page numbers.
