'use client';

import Image from 'next/image';
import api from '@/lib/api';
import { useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  trackView?: boolean;
}

export default function ProductCard({ product, trackView = true }: ProductCardProps) {
  useEffect(() => {
    if (trackView) {
      // Registra visualização de forma assíncrona (sem bloquear UI)
      api.post(`/products/${product.id}/view`).catch(() => {});
    }
  }, [product.id, trackView]);

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <div className="card p-0 overflow-hidden hover:shadow-md hover:-translate-y-0.5
                    transition-all duration-200 group">
      {/* Imagem */}
      <div className="relative h-44 bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm
                           rounded-full text-xs font-medium text-gray-600">
            {product.category}
          </span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">{product.description}</p>
        )}
        <span className="text-base font-bold bg-brand-gradient bg-clip-text text-transparent">
          {formattedPrice}
        </span>
      </div>
    </div>
  );
}
