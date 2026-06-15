'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { isAuthenticated, getStoredUser } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Começa como null para evitar hydration mismatch
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Toda leitura de localStorage fica SOMENTE no cliente
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    const user = getStoredUser();
    // Apenas contas "empresa" (role = admin) acessam o dashboard
    if (user?.role !== 'admin') {
      router.replace('/catalogo');
      return;
    }

    setAllowed(true);
  }, [router]);

  // Enquanto verifica, não renderiza nada (evita flash do conteúdo)
  if (allowed === null) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Sidebar />
      <main className="ml-60 min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
