<script lang="ts">
	import Dday from '$lib/components/Dday.svelte';
	import Video from '$lib/components/Video.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>
<div class="min-h-screen bg-(--surface) text-(--text)">
    <Dday target="2027-05-01T09:00:00+09:00" label="TOK" />
    <div class="my-10 mx-10 flow-root">
        <p class="text-xs my-5">FEATURED VIDEO</p>
        <Video src="" title="lemon" className="float-right ml-6 mb-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"/>
        <h1>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </h1>
</div>
    
</div>

