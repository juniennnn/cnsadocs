import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({locals, url}) => {
    const supabase = locals.supabase;

    // Open redirect 방지 목적
    const rawNext = url.searchParams.get('next') ?? '/app';
    const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/app';

    const { data, error: oautherror } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(next)}`
            }
    });

    if (oautherror || !data.url) {
        throw error(500, 'Google OAuth에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    throw redirect(303, data.url);
};
