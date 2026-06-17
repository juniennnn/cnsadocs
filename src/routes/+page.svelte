  <script lang="ts">
  import GoogleIcon from '$lib/assets/googleicon.svg';
  </script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<a href="/auth/login"
      class="mt-1 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-7 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
    >
      <img src={GoogleIcon} alt="Google" class="h-4 w-4 object-contain" />
      <span>접속하기</span>
      <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
    </a>