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

  let { rootToken, rootName = "내 드라이브" }: { rootToken: string; rootName?: string } = $props()

  let files = $state<DriveEntry[]>([])
  let loading = $state(true)
  let errorMessage = $state<string | null>(null)

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
    if (entry.mimeType.includes("document")) return "📄"
    if (entry.mimeType.includes("spreadsheet")) return "📊"
    if (entry.mimeType.includes("presentation")) return "📽️"
    if (entry.mimeType.includes("pdf")) return "📕"
    if (entry.mimeType.includes("image")) return "🖼️"
    if (entry.mimeType.includes("video")) return "🎬"
    return "📎"
  }

  function tooltip(entry: DriveEntry) {
    if (!entry.modifiedTime) return entry.name
    const modified = new Date(entry.modifiedTime).toLocaleDateString("ko-KR")
    return `${entry.name} · ${modified} 수정`
  }

  $effect(() => {
    loadFolder(crumbs[crumbs.length - 1].token)
  })
</script>

<div class="browser">
  <nav class="breadcrumb">
    {#each crumbs as crumb, i (crumb.token)}
      <button onclick={() => goToCrumb(i)} class:current={i === crumbs.length - 1}>
        {crumb.name}
      </button>
      {#if i < crumbs.length - 1}<span class="sep">/</span>{/if}
    {/each}
  </nav>

  {#if loading}
    <p class="status">불러오는 중...</p>
  {:else if errorMessage}
    <p class="status">{errorMessage}</p>
  {:else if files.length === 0}
    <p class="status">빈 폴더</p>
  {:else}
    <div class="grid">
      {#each files as file (file.token ?? file.link)}
        <button class="item" title={tooltip(file)} onclick={() => openEntry(file)}>
          <span class="icon">{fileIcon(file)}</span>
          <span class="name">{file.name}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .browser {
    color: var(--text);
  }
  .breadcrumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    padding: 8px 0;
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
  .item:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
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
</style>
