<script lang="ts">
  import DriveBrowser from "$lib/components/DriveBrowser.svelte"
  import type { PageData } from "./$types"

  let { data }: { data: PageData } = $props()
</script>

<DriveBrowser rootFolderId={data.rootFolderId} rootName="CNSAIBDP Docs" />
