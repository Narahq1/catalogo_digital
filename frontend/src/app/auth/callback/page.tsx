'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuth } from '@/lib/auth';
import Logo from '@/components/Logo';

function CallbackHandler() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const data  = searchParams.get('data');
    const dest  = searchParams.get('dest') || '/catalogo';
    const error = searchParams.get('error');

    if (error) {
      router.replace('/login?error=google');
      return;
    }

    if (!data) {
      router.replace('/login');
      return;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(data));
      setAuth(parsed.user, parsed.token);
      router.replace(dest);
    } catch {
      router.replace('/login');
    }
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-4">
      <Logo size="lg" />
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400">Autenticando com Google...</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-brand-light flex flex-col items-center justify-center gap-4">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Carregando...</p>
      </main>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
