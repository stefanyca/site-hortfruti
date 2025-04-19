import React from 'react';
import Produtos from './Produtos';

export default function Home() {
  return (
    <div className="font-poppins">
      {/* Intro Section */}
      <section className="text-center py-12 px-4 md:px-0 bg-green-50">
        <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
          Bem-vindo(a) ao Armazém do Sítio da Dona Lourdes 🍇
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          Aqui você encontra frutas fresquinhas, artesanatos únicos e o nosso exclusivo clube de assinaturas de
          frutas imperfeitas — direto da roça para a sua casa!
        </p>
        <img
          src="https://images.unsplash.com/photo-1615486361784-7fd5c1e5482e?auto=format&fit=crop&w=800&q=80"
          alt="Frutas frescas"
          className="w-full max-w-lg mx-auto rounded-lg shadow-lg mb-8"
        />
        <p className="text-base text-gray-600">
          🍎 Confira nosso <strong>catálogo</strong> abaixo ou explore nossas <strong>frutas renegadas</strong>!
        </p>
      </section>

      {/* Dynamic Products Section */}
      <section id="produtos" className="px-4 py-12">
        <Produtos />
      </section>
    </div>
  );
}
