'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ProductCard, { type Product } from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function CatalogoPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [categories, setCategories]   = useState<string[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [activeCategory, setActive]   = useState('');
  const [loggedIn, setLoggedIn]       = useState(false);

  useEffect(() => {
    // Leitura de localStorage apenas no cliente
    setLoggedIn(isAuthenticated());
  }, []);

  const debouncedSearch = useDebounce(search, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (debouncedSearch)  params.search   = debouncedSearch;
      if (activeCategory)   params.category = activeCategory;

      const { data } = await api.get('/products', { params });
      setProducts(data.products);

      // Extrair categorias únicas (somente na carga inicial)
      if (!debouncedSearch && !activeCategory) {
        const cats = [...new Set(
          data.products.map((p: Product) => p.category).filter(Boolean) as string[]
        )];
        setCategories(cats);
      }
    } catch {
      console.error('Erro ao carregar catálogo.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          {!loggedIn && (
            <Link
              href="/login"
              className="text-xs font-medium text-gray-500 hover:text-purple-600
                         border border-gray-200 hover:border-purple-300
                         px-4 py-2 rounded-lg transition-all duration-200"
            >
              Entrar
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Título */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Catálogo de Produtos</h1>
          <p className="text-sm text-gray-400">Explore nossa seleção de produtos e serviços</p>
        </div>

        {/* Barra de busca */}
        <div className="relative mb-6 max-w-xl mx-auto">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="input-field pl-11"
            type="search"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filtros por categoria */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setActive('')}
              className={activeCategory === '' ? 'pill-active' : 'pill'}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(activeCategory === cat ? '' : cat)}
                className={activeCategory === cat ? 'pill-active' : 'pill'}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid de produtos */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            message={
              debouncedSearch || activeCategory
                ? 'Nenhum produto encontrado para esta busca.'
                : 'Nenhum produto disponível neste catálogo no momento.'
            }
            icon={
              <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} trackView />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
