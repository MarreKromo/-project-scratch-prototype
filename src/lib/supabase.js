
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
    .select('id, display_name, created_at, onboarding_data')
    .eq('id', authData.user.id)
    .single();

  return { data, error };
}

export async function testProfileIsolation() {
  const { data: authData, error: authError } =
    await supabase.auth.getUser();

  if (authError) {
    return { success: false, message: authError.message };
  }

  if (!authData.user) {
    return { success: false, message: 'Inte inloggad.' };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .neq('id', authData.user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.length > 0) {
    return {
      success: false,
      message: 'SÄKERHETSFEL: Andra profiler är synliga!'
    };
  }

  return {
    success: true,
    message: 'Inga andra profiler är synliga.'
  };
}

export async function getMyRounds() {
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
    .from('rounds')
    .select('id, course_name, played_at, round_data')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function saveMyRound(round) {
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
    .from('rounds')
    
.insert({
  user_id: authData.user.id,
  course_name: round.courseName ?? round.course ?? null,
  played_at: round.playedAt ?? round.date ?? null,
  round_data: round
})

    .select('id, user_id, course_name, played_at')
    .single();

  return { data, error };
}

export async function saveMyCourse(course) {
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
    .from('courses')
    .insert({
      user_id: authData.user.id,
      course_data: course
    })
    .select('id, course_data')
    .single();

  return { data, error };
}

export async function getMyCourses() {
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
    .from('courses')
    .select('id, course_data')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: true });

  return { data, error };
}

export async function saveMyOnboarding(onboardingData) {
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
    .update({
      onboarding_data: onboardingData
    })
    .eq('id', authData.user.id)
    .select('id, onboarding_data')
    .single();

  return { data, error };
}

