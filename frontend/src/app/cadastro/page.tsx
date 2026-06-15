'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Logo from '@/components/Logo';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';

type Role = 'admin' | 'user';

export default function CadastroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as Role,
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role,
      });
      setAuth(data.user, data.token);
      toast.success('Conta criada com sucesso!');

      // Empresa → dashboard | Cliente → catálogo
      router.push(data.user.role === 'admin' ? '/dashboard' : '/catalogo');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error || 'Erro ao criar conta.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="card">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h1 className="text-xl font-semibold text-center text-gray-800 mb-1">Criar Conta</h1>
          <p className="text-sm text-center text-gray-400 mb-7">Junte-se ao Catálogo Digital</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Seleção de tipo de conta */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Tipo de conta</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'user' })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200
                    ${form.role === 'user'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                  <span className="block text-lg mb-1">👤</span>
                  Cliente
                  <span className="block text-xs font-normal text-gray-400 mt-0.5">
                    Explorar catálogos
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'admin' })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all duration-200
                    ${form.role === 'admin'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                >
                  <span className="block text-lg mb-1">🏢</span>
                  Empresa
                  <span className="block text-xs font-normal text-gray-400 mt-0.5">
                    Gerenciar produtos
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                {form.role === 'admin' ? 'Nome da Empresa / Responsável' : 'Nome Completo'}
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">E-mail</label>
              <input
                className="input-field"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Senha</label>
              <input
                className="input-field"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirmar Senha</label>
              <input
                className="input-field"
                type="password"
                placeholder="Repita a senha"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? 'Criando conta...' : `Criar Conta ${form.role === 'admin' ? 'Empresa' : 'Cliente'}`}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-purple-500 hover:underline font-medium">
              Faça Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
