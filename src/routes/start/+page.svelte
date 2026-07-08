<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';

    let { data, form }: PageProps = $props();
</script>
<div class="relative">
    <div class="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl"></div>
        <div class="text-center text-sm items-center gap-10 border-2 px-10 py-10 mx-10 my-10 rounded-xl font-sans">
            <h1 class="text-left text-xl">아이디를 입력해주세요:</h1><br>
            <p class="mt-2 text-sm text-zinc-400">
            This is how other students will see you on the platform.
            </p>
        <form method="POST" use:enhance>
        <div>
            <label for="name">ID (2~10자)</label>
                <input
                id="name"
                name="name"
                type="text"
                minlength="2"
                maxlength="10"
                required
                placeholder="asdf1234"
                class="border-0 bg-amber-200 rounded-xl"
            />
        </div> 
        <button class="px-4 py-2 my-5 rounded-xl bg-amber-300 hover:bg-amber-100 active:bg-amber-400" type="submit">시작하기</button>
        </form>
    </div>
</div>

{#if form?.error}
    <p>{form.error}</p>
{/if}

