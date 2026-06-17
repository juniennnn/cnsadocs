import type { RequestHandler } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals: { supabase } }) => {

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
        throw error(500, '로그아웃에 실패했습니다.');
    }
    
    throw redirect(303, '/');
};