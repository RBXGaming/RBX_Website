import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Admin sessions are tracked separately from customer OTP sessions.
 * Admins use email + password; customers use mobile phone OTP.
 */
export const ADMIN_SESSION_KEY = 'rbx_admin_authenticated';

export interface AdminUser {
  email: string;
  role: 'admin';
  isAuthenticated: boolean;
  id?: string;
}

/**
 * Log in as admin via Supabase Auth
 */
export async function loginAdmin(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  // If Supabase is configured, use official Supabase Auth
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user: AdminUser = {
          email: data.user.email || cleanEmail,
          role: 'admin',
          isAuthenticated: true,
          id: data.user.id,
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
        return { success: true, user };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Supabase Auth connection error.' };
    }
  }

  // If Supabase is NOT yet configured in .env
  return {
    success: false,
    error:
      'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable Supabase authentication.',
  };
}

/**
 * Log out admin
 * Admin logout only clears the admin session marker so it never destroys a
 * customer's Supabase OTP session (the two auth flows stay fully separate).
 */
export async function logoutAdmin(): Promise<void> {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

/**
 * Check active admin session
 */
export function getAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...parsed, isAuthenticated: true };
  } catch (e) {
    return null;
  }
}
