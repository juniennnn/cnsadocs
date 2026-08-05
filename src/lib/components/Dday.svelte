<script lang="ts">
    import { slide } from 'svelte/transition';
    type Props = {
        //이렇게 써야함: '2026-05-01T09:00:00+09:00' (한국 기준으로 UTF+9)
        target: string;
        label: string;
        doneText?: string;
    };

    let { target, label, doneText = '종료됨' }: Props = $props();

    const targetMs = $derived(new Date(target).getTime());
    let now = $state(Date.now());

    $effect(() => {
        const id = setInterval(() => (now = Date.now()), 1000);
        return () => clearInterval(id);
    });

    const diff = $derived(Math.max(0, targetMs - now));
    const over = $derived(diff === 0);

    const t = $derived({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor(diff / 3_600_000) % 24,
        minutes: Math.floor(diff / 60_000) % 60,
        seconds: Math.floor(diff / 1000) % 60
    });

    const pad = (n: number) => String(n).padStart(2, '0');
</script>

<div class="mx-10">
        <p class="text-sm text-zinc-400">{label}</p>
    {#if over}
        <p class="mt-2 text-xl font-semibold text-zinc-500">{doneText}</p>
    {:else}
        <!-- D-n 은 남은 일수 기준 -->

        <div class="flex items-start gap-3" aria-hidden="true">
            <p class="mt-2 text-3xl font-semibold tracking-tight text-white">
                D-{t.days}
            </p>
            
            {#each [ ['HRS', t.hours], ['MIN', t.minutes], ['SEC', t.seconds]] as [unit, value] (unit)}
                <div class="flex flex-col relative h-12 w-40 rounded-xl bg-gray-900/85 py-3">
                    {#key value}
                        <div class="absolute inset-0 flex items-center justify-center text-2xl font-semibold tabular-nums text-white" transition:slide={{duration : 250}}>
                            {pad(value as number)}
                        </div>
                    {/key} 
                    <div class="absolute inset-0 flex items-center justify-center text-[11px] text-zinc-500">{unit}</div>
                </div>
            {/each}
            
        </div>
        <span class="sr-only">
            {t.days}일 {t.hours}시간 {t.minutes}분 남음
        </span>
    {/if}
</div>
