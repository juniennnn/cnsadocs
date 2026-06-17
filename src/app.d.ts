// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, User, SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}

		interface Locals {
            session: Session | null;
            user: User | null;
			supabase: SupabaseClient;
            safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
        }
		
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
