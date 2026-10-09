
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

