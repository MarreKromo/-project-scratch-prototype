
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export async function testSupabaseConnection() {
  try {
    
const { error } = await supabase.auth.getSession();


    if (error) {
      return {
        success: false,
        message: error.message
      };
    }

    return {
      success: true,
      message: 'Supabase API svarar!'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  return { error };
}

export async function getMyProfile() {
  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  if (authError) {
    return { data: null, error: authError };
  }

  if (!authData.user) {
    return {
      data: null,
      error: new Error('Ingen användare är inloggad.')
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, created_at')
    .eq('id', authData.user.id)
    .single();

  return { data, error };
}

