<script lang="ts">
  interface DriveFile {
    id: string
    name: string
    mimeType: string
    webViewLink?: string
    thumbnailLink?: string
    iconLink?: string
    modifiedTime?: string
  }

  interface Crumb {
    id: string
    name: string
  }

  let { rootFolderId, rootName = "내 드라이브" } = $props<{
    rootFolderId: string
    rootName?: string
  }>()

  let files = $state<DriveFile[]>([])
  let loading = $state(true)
  let errorMessage = $state<string | null>(null)
  let crumbs = $state<Crumb[]>([])

  const FOLDER_MIME = "application/vnd.google-apps.folder"

  // Guards against a slow response for an earlier folder overwriting a newer one.
  let requestId = 0

  async function loadFolder(folderId: string) {
    const id = ++requestId
    loading = true
    errorMessage = null
    try {
      const res = await fetch(`/api/drive/${folderId}`)
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { files: DriveFile[] }
      if (id !== requestId) return
      files = data.files
    } catch {
      if (id !== requestId) return
      files = []
      errorMessage = "폴더를 불러오지 못했습니다."
    } finally {
      if (id === requestId) loading = false
    }
  }

  function openFolder(file: DriveFile) {
    crumbs = [...crumbs, { id: file.id, name: file.name }]
    loadFolder(file.id)
  }

  function goToCrumb(index: number) {
    crumbs = crumbs.slice(0, index + 1)
    loadFolder(crumbs[index].id)
  }

  function fileIcon(mimeType: string) {
    if (mimeType === FOLDER_MIME) return "📁"
    if (mimeType.includes("document")) return "📄"
    if (mimeType.includes("spreadsheet")) return "📊"
    if (mimeType.includes("presentation")) return "📽️"
    if (mimeType.includes("pdf")) return "📕"
    if (mimeType.includes("image")) return "🖼️"
    return "📎"
  }

  $effect(() => {
    crumbs = [{ id: rootFolderId, name: rootName }]
    loadFolder(rootFolderId)
  })
</script>

<div class="browser">
  <nav class="breadcrumb">
    {#each crumbs as crumb, i}
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
      {#each files as file}
        <button
          class="item"
          ondblclick={() => file.mimeType === FOLDER_MIME
            ? openFolder(file)
            : window.open(file.webViewLink, "_blank")}
        >
          {#if file.thumbnailLink}
            <img src={file.thumbnailLink} alt="" class="thumb" />
          {:else}
            <span class="icon">{fileIcon(file.mimeType)}</span>
          {/if}
          <span class="name">{file.name}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .browser {
    font-family: system-ui, sans-serif;
  }
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 0;
    font-size: 14px;
  }
  .breadcrumb button {
    background: none;
    border: none;
    cursor: pointer;
    color: #5f6368;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .breadcrumb button:hover {
    background: #f1f3f4;
  }
  .breadcrumb button.current {
    color: #202124;
    font-weight: 500;
  }
  .sep {
    color: #5f6368;
  }
  .status {
    color: #5f6368;
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
  }
  .item:hover {
    background: #f1f3f4;
    border-color: #dadce0;
  }
  .icon {
    font-size: 40px;
  }
  .thumb {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 4px;
  }
  .name {
    font-size: 12px;
    text-align: center;
    word-break: break-word;
    color: #202124;
  }
</style>