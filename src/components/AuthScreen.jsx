
import React, { useState } from 'react';
import { signUp, signIn } from '../lib/supabase.js';

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage('');

    try {
      const { data, error } = mode === 'login'
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

      if (error) throw error;

      if (data?.session) {
        onAuthenticated?.(data.session);
      } else {
        setMessage(
          'Kontrollera din e-post för att bekräfta kontot.'
        );
      }
    } catch (error) {
      setMessage(error.message || 'Något gick fel.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      maxWidth: 420,
      margin: '60px auto',
      padding: 24
    }}>
      <h1>PROJECT SCRATCH</h1>
      <p>Din resa mot bättre golf börjar här.</p>

      <h2>
        {mode === 'login' ? 'Logga in' : 'Skapa konto'}
      </h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="auth-email">E-post</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="auth-password">Lösenord</label>
        <input
          id="auth-password"
          type="password"
          autoComplete={
            mode === 'login'
              ? 'current-password'
              : 'new-password'
          }
          minLength={6}
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading
            ? 'Vänta...'
            : mode === 'login'
              ? 'Logga in'
              : 'Skapa konto'}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <button
        type="button"
        onClick={() => {
          setMode(mode === 'login' ? 'signup' : 'login');
          setMessage('');
        }}
      >
        {mode === 'login'
          ? 'Inget konto? Registrera dig'
          : 'Har du konto? Logga in'}
      </button>
    </main>
  );
}
