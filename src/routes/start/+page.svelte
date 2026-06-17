<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';

    let { data, form }: PageProps = $props();
</script>

<div class="mx-auto text-center items-center gap-10">
    <br class="my-10">
    <p class="text-xl text-left mx-9">{data.user.email}</p><br>
    <h1 class="text-left mx-9">아이디를 입력해주세요:</h1><br>
    <form method="POST" use:enhance>
       <div>
            <label for="name">아이디 (2~10자)</label>
                <input
                id="name"
                name="name"
                type="text"
                minlength="2"
                maxlength="10"
                required
                class="border-0 bg-amber-200 rounded-xl"
            />
        </div> 
    </form>
    <br class="my-10">
    <button class="px-4 py-2 bg-amber-300 rounded-xl" type="submit">시작하기</button>
</div>
    {#if form?.error}
        <p>{form.error}</p>
    {/if}

