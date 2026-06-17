import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({locals, url}) => {
  const { user } = locals;

  if (!user) {
  const next = url.pathname + url.search;
  throw redirect(303, `/auth/login?next=${encodeURIComponent(next)}`);
  }

  const { data, error: profileError } = await locals.supabase
    .from('users')
    .select('id, name')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    throw error(500, '사용자 정보를 불러오는 중에 오류가 발생했습니다.');
  }

  if (!data) {
    throw redirect(303, '/start');
  }

  return { user };
};