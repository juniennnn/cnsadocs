<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import homeicon from '$lib/assets/homeicon.svg';
    import { page } from '$app/state'; 

	let { children } = $props();
</script>
<div class="mx-auto bg-gray-900  backdrop-blur p-2">
	<div class="text-center flex items-center gap-6 text-s min-h-10 max-w-md mx-auto text-white 
				justify-center">
    	<a href="/app" aria-label="Home"
			class="p-2 rounded-full bg-gray-700 hover:bg-gray-500 transition-all {page.url.pathname === '/app' ? 'border border-gray-400' : ''}">
			<img class="w-6 h-6" src={homeicon} alt="">
		</a>
		<a href="/resources" class="p-2 rounded-full hover:bg-gray-700 transition-all {page.url.pathname === '/resources' ? 'border border-gray-400' : ''}">Resources</a>
		<a href="/ib-core" class="p-2 rounded-full hover:bg-gray-700 transition-all {page.url.pathname === '/ib-core' ? 'border border-gray-400' : ''}">IB Core</a>
		<a href="/university" class="p-2 rounded-full hover:bg-gray-700 transition-all {page.url.pathname === '/university' ? 'border border-gray-400' : ''}">University</a>
	</div>
</div>


<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
