import { fail, error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = locals;
  if (!user) throw redirect(303, '/auth/login?next=/start');

  const { data, error: dbError } = await locals.supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (dbError) throw error(500, '사용자 정보를 불러오는 중에 오류가 발생했습니다.');
  if (data) throw redirect(303, '/app');

  return { user };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const { user } = locals;
    if (!user) throw redirect(303, '/auth/login?next=/start');

    const formData = await request.formData();
    const raw = formData.get('name');

    if (typeof raw !== 'string') return fail(400, { error: 'id를 입력해주세요.' });
    const name = raw.trim().normalize(); //한국어 입력 정규화
    if (!name) return fail(400, { error: 'id을 입력해주세요.' });
    if (name.length < 2 || name.length > 10) return fail(400, { error: '아이디는 2자에서 10자 사이여야 합니다.' });

    const { error: dberror } = await locals.supabase.from('users').insert({
      id: user.id,
      name,
    });

    if (dberror) {
      return fail(500, { error: '저장에 실패했습니다.' });
    }

    throw redirect(303, '/app');
  },
};