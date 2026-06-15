import Link from 'next/link';
import Logo from '@/components/Logo';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-4">
      <Logo size="lg" className="mb-8" />
      <h1 className="text-6xl font-bold text-gray-200 mb-2">404</h1>
      <p className="text-gray-400 mb-6 text-sm">Esta página não existe.</p>
      <Link href="/catalogo" className="btn-primary w-auto px-8">
        Voltar ao Catálogo
      </Link>
    </main>
  );
}
