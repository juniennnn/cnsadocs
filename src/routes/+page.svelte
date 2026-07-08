<script lang="ts">
    import GoogleIcon from '$lib/assets/googleicon.svg';
</script>
 
<div class="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
    <div class="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl"></div>
    <div class="relative flex flex-col items-center gap-6">
        <div>
            <h1 class="text-2xl font-semibold text-white">Welcome to CNSA IB DOCS</h1>
            <p class="mt-2 text-sm text-zinc-400">
                IB 학생들을 위한 자료 공유 플랫폼<br>
                학교 계정으로 로그인하세요
            </p>
        </div>
        <a href="/auth/login"
            class="group inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-7 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
        >
            <img src={GoogleIcon} alt="Google" class="h-4 w-4 object-contain"/>
            <span>접속하기</span>
            <span aria-hidden="true" class="transition-transform group-hover:translate-x-1">→</span>
        </a>
    </div>
</div>