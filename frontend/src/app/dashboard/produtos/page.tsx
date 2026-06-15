'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import toast from 'react-hot-toast';
import ProductFormModal from '@/components/ProductFormModal';
import EmptyState from '@/components/EmptyState';
import type { Product } from '@/components/ProductCard';

export default function ProdutosPage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Product | null>(null);
  const [userName, setUserName]   = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const user = getStoredUser();

  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      // Filtra apenas os produtos do usuário logado
      const mine = data.products.filter((p: Product & { user_id: string }) => p.user_id === user?.id);
      setProducts(mine);
    } catch {
      toast.error('Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produto excluído.');
      fetchProducts();
    } catch {
      toast.error('Erro ao excluir produto.');
    }
  }

  function handleEdit(product: Product) {
    setEditing(product);
    setModalOpen(true);
  }

  function handleNew() {
    setEditing(null);
    setModalOpen(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    // Em um sistema completo, aqui chamaríamos PUT /api/users/me
    setTimeout(() => {
      toast.success('Perfil atualizado!');
      setSavingProfile(false);
    }, 600);
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
        <p className="text-sm text-gray-400 mt-1">Gerencie seu perfil e produtos</p>
      </div>

      {/* Seção de Perfil */}
      <div className="card mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-5">Perfil</h2>
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Nome</label>
            <input
              className="input-field"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">E-mail</label>
            <input
              className="input-field"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white
                         bg-brand-gradient hover:opacity-90 transition-all duration-200
                         disabled:opacity-50 cursor-pointer"
            >
              {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Seção de Produtos */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-700">Meus Produtos</h2>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                       text-white bg-brand-gradient hover:opacity-90 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Novo Produto
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            message="Você ainda não cadastrou nenhum produto. Clique em Adicionar Novo Produto para começar."
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-400">Produto</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-gray-400">Categoria</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-gray-400">Preço</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-2">
                      <span className="font-medium text-gray-700">{p.name}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-gray-400">{p.category || '—'}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className="font-semibold text-gray-700">{formatPrice(p.price)}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProductFormModal
          product={editing}
          onClose={() => setModalOpen(false)}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}
