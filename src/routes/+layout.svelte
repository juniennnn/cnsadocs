<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import homeicon from '$lib/assets/homeicon.svg';
	import instaicon from '$lib/assets/instaicon.svg';
	import logo from '$lib/assets/logo.svg';
    import { page } from '$app/state'; 
	import { slide } from 'svelte/transition';
	let menuOpen = $state(false);
	function clickMenu() {
		menuOpen = !menuOpen;
	}
	let { children } = $props();
</script>
<div class="mx-auto bg-(--surface)/95 backdrop-blur-10xl p-2 sticky top-0 z-10">

	<div class="text-center flex justify-between items-center gap-6 text-s h-10 max-w-xl mx-auto text-(--text)">
		<div class="absolute left-4">
			<a href="/app" aria-label="Logo">
				<img class="h-10 w-auto" src={logo} alt="">
			</a>
		</div>

		<div class="flex mx-auto gap-3">
			<a href="/app" aria-label="Home"
				class="hidden sm:flex p-2 rounded-xl bg-(--surface) hover:bg-(--border) transition-all {page.url.pathname === '/app' ? 'border border-(--accent)' : 'border-transparent'}">
				<img class="w-6 h-auto" src={homeicon} alt="">
			</a>
			<a href="/app/resources" class="hidden sm:flex p-2 rounded-full hover:bg-(--border) transition-all {page.url.pathname === '/app/resources' ? 'border border-(--accent)' : 'border-transparent'}">Resources</a>
			<a href="/app/ib-core" class="hidden sm:flex p-2 rounded-full hover:bg-(--border) transition-all {page.url.pathname === '/app/ib-core' ? 'border border-(--accent)' : 'border-transparent'}">IB Core</a>
			<a href="/app/university" class="hidden sm:flex p-2 rounded-full hover:bg-(--border) transition-all {page.url.pathname === '/app/university' ? 'border border-(--accent)' : 'border-transparent'}">University</a>
		</div>

		<div class="absolute right-4 flex items-center gap-3">
			<a href="/app" aria-label="Instagram"
				class=" p-1 rounded-xl hover:bg-(--border) transition-all border-transparent">
				<img class="w-8 h-8" src={instaicon} alt="">
			</a>
			<button onclick={clickMenu} aria-label="Burger Menu" class="sm:hidden">
				<span class="transition-all h-0.5 w-5 bg-(--text) block my-1.5 {menuOpen ? 'translate-y-2 rotate-45' : ''}"></span>
				<span class="transition-all h-0.5 w-5 bg-(--text) block my-1.5 {menuOpen ? 'opacity-0' : ''}"></span>
				<span class="transition-all h-0.5 w-5 bg-(--text) block my-1.5 {menuOpen ? '-translate-y-2 -rotate-45' : ''}"></span>
			</button>
		</div>
	</div>
	{#if menuOpen}
		<div class="mx-auto bg-(--surface) flex flex-col px-1 py-2 text-(--text) rounded-2xl" transition:slide={{duration: 300}}>
			<a href="/app" onclick={clickMenu} class="p-2 rounded-full hover:bg-(--border) transition-all {page.url.pathname === '/app' ? 'border border-(--accent)' : 'border-transparent'}">Home</a>
			<a href="/app/resources" onclick={clickMenu} class="p-2 rounded-full hover:bg-(--border) transition-all {page.url.pathname === '/app/resources' ? 'border border-(--accent)' : 'border-transparent'}">Resources</a>
			<a href="/app/ib-core" onclick={clickMenu} class="p-2 rounded-full hover:bg-(--border) transition-all {page.url.pathname === '/app/ib-core' ? 'border border-(--accent)' : 'border-transparent'}">IB Core</a>
			<a href="/app/university" onclick={clickMenu} class="p-2 rounded-full hover:bg-(--border) transition-all {page.url.pathname === '/app/university' ? 'border border-(--accent)' : 'border-transparent'}">University</a>
		</div>
	{/if}	
</div>


<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
