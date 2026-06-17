<script lang="ts">
    import type { PageProps } from './$types';
    import { enhance } from '$app/forms';

    let { data, form }: PageProps = $props();
</script>

<h1>아이디를 입력해주세요</h1>
<p>{data.user.email}</p>

<form method="POST" use:enhance>
    <label for="name">아이디 (2~10자)</label>
    <input
        id="name"
        name="name"
        type="text"
        minlength="2"
        maxlength="10"
        required
    />
    {#if form?.error}
        <p>{form.error}</p>
    {/if}
    <button type="submit">시작하기</button>
</form>
