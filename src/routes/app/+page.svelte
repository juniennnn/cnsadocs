<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 text-center">
    <div class="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl"></div>
    <div class="relative flex flex-col items-center gap-6">
            <h1 class="text-2xl font-semibold text-white">Welcome to CNSA IB DOCS</h1>
            <p class="mt-2 text-sm text-zinc-400">
                IB 학생들을 위한 자료 공유 플랫폼<br>
            </p>

    </div>
</div>