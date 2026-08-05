<script lang="ts">
    type Props = {
        src: string;
        title: string;
        start?: number;
        ratio?: string;
        className?: string;
    };

    let { src, title, start = 0, ratio = 'aspect-video', className = 'w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10'}: Props = $props();
    let activated = $state(false);

    const isLocal = $derived(!src.startsWith('http'));

    const YT = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/;
    const id = $derived(src.match(YT)?.[1] ?? src);

    const embedUrl = $derived.by(() => {
        const q = new URLSearchParams({ rel: '0', modestbranding: '1' });
        if (start) q.set('start', String(start));
        if (activated) q.set('autoplay', '1');
        return `https://www.youtube-nocookie.com/embed/${id}?${q}`;
    });
</script>

<div class="{ratio} {className}">
    {#if isLocal}
        <video controls class="h-full w-full">
            <source src={src} type="video/mp4">
            <track kind="captions">
        </video>
    {:else}
    <iframe
        class="h-full w-full"
        src={embedUrl}
        {title}
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
    </iframe>
    {/if}
</div>
