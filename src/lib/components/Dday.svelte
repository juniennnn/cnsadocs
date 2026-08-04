<script lang="ts">
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

<div>
        <p class="text-sm text-zinc-400">{label}</p>
    {#if over}
        <p class="mt-2 text-xl font-semibold text-zinc-500">{doneText}</p>
    {:else}
        <!-- D-n 은 남은 일수 기준 -->
        <p class="mt-1 text-3xl font-semibold tracking-tight text-white">
            D-{t.days}
        </p>

        <div class="mt-4 grid grid-cols-4 gap-2 text-center" aria-hidden="true">
            {#each [['일', t.days], ['시간', t.hours], ['분', t.minutes], ['초', t.seconds]] as [unit, value] (unit)}
                <div class="rounded-xl bg-black py-3">
                    <div class="text-2xl font-semibold tabular-nums text-white">
                        {pad(value as number)}
                    </div>
                    <div class="mt-0.5 text-[11px] text-zinc-500">{unit}</div>
                </div>
            {/each}
        </div>
        <span class="sr-only">
            {t.days}일 {t.hours}시간 {t.minutes}분 남음
        </span>
    {/if}
</div>
