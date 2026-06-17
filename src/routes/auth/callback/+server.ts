import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code');

    // Open redirect 방지 목적
    const rawNext = url.searchParams.get('next') ?? '/app';
    const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/app';

    if (!code) {
        throw error(400, '로그인에 실패했습니다. 링크가 만료되었습니다.');
    }

    const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
    if (authError) {
        throw error(400, '로그인에 실패했습니다. 계정 생성에 오류가 발생했습니다.');
    }

    throw redirect(303, next);
};
