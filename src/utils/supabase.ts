import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// null means "demo mode": responses stay in this browser only.
export const supabase = url && key ? createClient(url, key) : null;

// The one researcher account created in Supabase (Authentication > Users).
// Its password is the researcher passkey.
export const RESEARCHER_EMAIL = (import.meta.env.VITE_RESEARCHER_EMAIL as string | undefined) || '';
