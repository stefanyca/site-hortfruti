// src/pages/CestaDaSemana.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';  // Firebase já configurado
import { collection, getDocs } from 'firebase/firestore';

const CestaDaSemana = () => {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const querySnapshot = await getDocs(collection(db, 'cesta-da-semana'));
      setProdutos(querySnapshot.docs.map(doc => doc.data()));
    };

    fetchProdutos();
  }, []);

  return (
    <section id="cesta-da-semana" className="px-8 py-20 bg-green-50 text-center">
      <h3 className="text-3xl font-bold text-green-900 mb-6">Cesta da Semana</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {produtos.map((produto, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow hover:scale-105 transition">
            <h4 className="font-semibold text-green-800 mb-2">{produto.nome}</h4>
            <p className="text-gray-600">Preço: R${produto.preco}</p>
            <img src={produto.imagemUrl} alt={produto.nome} className="mt-4 w-full h-40 object-cover rounded" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CestaDaSemana;
