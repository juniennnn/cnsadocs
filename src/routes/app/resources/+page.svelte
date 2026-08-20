<script lang="ts">
  import DriveBrowser from "$lib/components/DriveBrowser.svelte"
  import type { PageData } from "./$types"

  let { data }: { data: PageData } = $props()
</script>

<div class="min-h-screen bg-(--bg) text-(--text) px-6 py-6 sm:px-10">
  <DriveBrowser rootToken={data.rootToken} rootName="CNSAIBDP Docs" />
</div>
