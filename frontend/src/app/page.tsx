import { redirect } from 'next/navigation';

// Redireciona a raiz para o catálogo público
export default function Home() {
  redirect('/catalogo');
}
