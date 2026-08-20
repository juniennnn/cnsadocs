<script lang="ts">
  import { pushState } from "$app/navigation"
  import { page } from "$app/state"

  interface DriveEntry {
    name: string
    mimeType: string
    isFolder: boolean
    modifiedTime?: string
    /** Signed folder token — folders only. */
    token?: string
    /** Drive web link — files only. */
    link?: string
  }

  interface Crumb {
    token: string
    name: string
  }

  type ViewMode = "grid" | "list"

  const VIEW_STORAGE_KEY = "drive-view"

  let { rootToken, rootName = "내 드라이브" }: { rootToken: string; rootName?: string } = $props()

  let files = $state<DriveEntry[]>([])
  let loading = $state(true)
  let errorMessage = $state<string | null>(null)

  // Starts as "grid" so SSR and hydration agree; the saved choice is applied
  // right after mount by the effect below.
  let view = $state<ViewMode>("grid")
  let viewRestored = false

  // The trail lives in history state, so the browser back button walks back up
  // the folder tree without leaving the page.
  const crumbs = $derived<Crumb[]>(page.state.driveCrumbs ?? [{ token: rootToken, name: rootName }])

  // Guards against a slow response for an earlier folder overwriting a newer one.
  let requestId = 0

  async function loadFolder(token: string) {
    const id = ++requestId
    loading = true
    errorMessage = null
    try {
      const res = await fetch(`/api/drive?folder=${encodeURIComponent(token)}`)
      if (!res.ok) {
        // SvelteKit sends `error()` messages as { message }; keep it so the user
        // sees "로그인이 필요합니다" rather than a blanket failure.
        const detail = await res
          .clone()
          .json()
          .then((body) => (body as { message?: string }).message)
          .catch(() => null)
        throw new Error(detail || `요청이 실패했습니다 (HTTP ${res.status})`)
      }
      const data = (await res.json()) as { files: DriveEntry[] }
      if (id !== requestId) return
      files = data.files
    } catch (cause) {
      if (id !== requestId) return
      files = []
      errorMessage = cause instanceof Error ? cause.message : "폴더를 불러오지 못했습니다."
      console.error("[DriveBrowser] failed to load folder", cause)
    } finally {
      if (id === requestId) loading = false
    }
  }

  function setView(next: ViewMode) {
    view = next
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, next)
    } catch {
      // Private mode or blocked storage — the choice just won't persist.
    }
  }

  function openEntry(entry: DriveEntry) {
    if (entry.isFolder) {
      if (entry.token) {
        pushState("", { driveCrumbs: [...crumbs, { token: entry.token, name: entry.name }] })
      }
    } else if (entry.link) {
      window.open(entry.link, "_blank", "noopener")
    }
  }

  function goToCrumb(index: number) {
    if (index === crumbs.length - 1) return
    pushState("", { driveCrumbs: crumbs.slice(0, index + 1) })
  }

  function fileIcon(entry: DriveEntry) {
    if (entry.isFolder) return "📁"
    if (entry.mimeType.includes("spreadsheet")) return "📊"
    if (entry.mimeType.includes("presentation")) return "📽️"
    if (entry.mimeType.includes("pdf")) return "📕"
    if (entry.mimeType.includes("image")) return "🖼️"
    if (entry.mimeType.includes("video")) return "🎬"
    if (entry.mimeType.includes("document")) return "📄"
    return "📎"
  }

  function kindLabel(entry: DriveEntry) {
    if (entry.isFolder) return "폴더"
    if (entry.mimeType.includes("spreadsheet")) return "스프레드시트"
    if (entry.mimeType.includes("presentation")) return "프레젠테이션"
    if (entry.mimeType.includes("pdf")) return "PDF"
    if (entry.mimeType.includes("image")) return "이미지"
    if (entry.mimeType.includes("video")) return "동영상"
    if (entry.mimeType.includes("document")) return "문서"
    return "파일"
  }

  function formatDate(value?: string) {
    if (!value) return "—"
    return new Date(value).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
  }

  function tooltip(entry: DriveEntry) {
    if (!entry.modifiedTime) return entry.name
    return `${entry.name} · ${formatDate(entry.modifiedTime)} 수정`
  }

  $effect(() => {
    if (viewRestored) return
    viewRestored = true
    try {
      const saved = localStorage.getItem(VIEW_STORAGE_KEY)
      if (saved === "grid" || saved === "list") view = saved
    } catch {
      // Ignore and keep the default.
    }
  })

  $effect(() => {
    loadFolder(crumbs[crumbs.length - 1].token)
  })
</script>

<div class="browser">
  <div class="toolbar">
    <nav class="breadcrumb" aria-label="폴더 경로">
      {#each crumbs as crumb, i (crumb.token)}
        <button onclick={() => goToCrumb(i)} class:current={i === crumbs.length - 1}>
          {crumb.name}
        </button>
        {#if i < crumbs.length - 1}<span class="sep">/</span>{/if}
      {/each}
    </nav>

    <div class="view-toggle" role="group" aria-label="보기 방식">
      <button
        onclick={() => setView("grid")}
        aria-pressed={view === "grid"}
        aria-label="아이콘 보기"
        title="아이콘 보기"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1.5" />
          <rect x="9" y="1" width="6" height="6" rx="1.5" />
          <rect x="1" y="9" width="6" height="6" rx="1.5" />
          <rect x="9" y="9" width="6" height="6" rx="1.5" />
        </svg>
      </button>
      <button
        onclick={() => setView("list")}
        aria-pressed={view === "list"}
        aria-label="목록 보기"
        title="목록 보기"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="1" y="2" width="3" height="3" rx="1" />
          <rect x="6" y="2.75" width="9" height="1.5" rx="0.75" />
          <rect x="1" y="6.5" width="3" height="3" rx="1" />
          <rect x="6" y="7.25" width="9" height="1.5" rx="0.75" />
          <rect x="1" y="11" width="3" height="3" rx="1" />
          <rect x="6" y="11.75" width="9" height="1.5" rx="0.75" />
        </svg>
      </button>
    </div>
  </div>

  {#if loading}
    <p class="status">불러오는 중...</p>
  {:else if errorMessage}
    <p class="status">{errorMessage}</p>
  {:else if files.length === 0}
    <p class="status">빈 폴더</p>
  {:else if view === "grid"}
    <div class="grid">
      {#each files as file (file.token ?? file.link)}
        <button class="item" title={tooltip(file)} onclick={() => openEntry(file)}>
          <span class="icon">{fileIcon(file)}</span>
          <span class="name">{file.name}</span>
        </button>
      {/each}
    </div>
  {:else}
    <div class="list">
      <div class="row head" aria-hidden="true">
        <span></span>
        <span>이름</span>
        <span class="col-kind">종류</span>
        <span class="col-date">수정일</span>
      </div>
      {#each files as file (file.token ?? file.link)}
        <button class="row" title={tooltip(file)} onclick={() => openEntry(file)}>
          <span class="row-icon">{fileIcon(file)}</span>
          <span class="row-name">{file.name}</span>
          <span class="col-kind row-meta">{kindLabel(file)}</span>
          <span class="col-date row-meta">{formatDate(file.modifiedTime)}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .browser {
    color: var(--text);
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0;
  }
  .breadcrumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    min-width: 0;
    font-size: 14px;
  }
  .breadcrumb button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    padding: 4px 8px;
    border-radius: 9999px;
    transition: background-color 0.2s;
  }
  .breadcrumb button:hover {
    background: var(--border);
  }
  .breadcrumb button.current {
    color: var(--text);
    font-weight: 500;
    cursor: default;
  }
  .breadcrumb button.current:hover {
    background: none;
  }
  .sep {
    color: var(--muted);
  }

  .view-toggle {
    display: flex;
    flex: none;
    gap: 2px;
    padding: 2px;
    border: 1px solid var(--border);
    border-radius: 9999px;
  }
  .view-toggle button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    border: none;
    border-radius: 9999px;
    background: none;
    color: var(--muted);
    cursor: pointer;
    transition:
      background-color 0.2s,
      color 0.2s;
  }
  .view-toggle button:hover {
    color: var(--text);
  }
  .view-toggle button[aria-pressed="true"] {
    background: var(--border);
    color: var(--text);
  }
  .view-toggle svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  .status {
    color: var(--muted);
    padding: 24px 0;
    text-align: center;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    padding: 16px 0;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .item:hover {
    background: var(--surface);
    border-color: var(--border);
  }
  .icon {
    font-size: 40px;
    line-height: 1;
  }
  .name {
    font-size: 12px;
    text-align: center;
    word-break: break-word;
    color: var(--text);
  }

  .list {
    display: flex;
    flex-direction: column;
    padding: 8px 0 16px;
  }
  .row {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) 7rem 6.5rem;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: none;
    color: var(--text);
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .row:hover {
    background: var(--surface);
    border-color: var(--border);
  }
  .row.head {
    padding-top: 4px;
    padding-bottom: 8px;
    font-size: 12px;
    color: var(--muted);
    cursor: default;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
  }
  .row.head:hover {
    background: none;
    border-color: transparent;
    border-bottom-color: var(--border);
  }
  .row-icon {
    font-size: 18px;
    line-height: 1;
  }
  .row-name {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row-meta {
    font-size: 12px;
    color: var(--muted);
    white-space: nowrap;
  }

  .item:focus-visible,
  .row:focus-visible,
  .view-toggle button:focus-visible,
  .breadcrumb button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    .row {
      grid-template-columns: 24px minmax(0, 1fr);
    }
    .col-kind,
    .col-date {
      display: none;
    }
  }
</style>
