import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CarrinhoPage({ carrinho, removerDoCarrinho }) {
  const navigate = useNavigate();

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>

      {carrinho.length === 0 ? (
        <p className="text-gray-600">O carrinho está vazio.</p>
      ) : (
        <>
          <ul className="mb-6 space-y-4">
            {carrinho.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.nome}</p>
                  <p className="text-sm text-gray-600">
                    Quantidade: {item.quantidade} | Preço: R$ {item.preco.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removerDoCarrinho(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <p className="text-lg font-semibold mb-4">
            Total: R$ {total.toFixed(2)}
          </p>

          <div className="flex justify-between">
            <button
              onClick={() => navigate('/loja')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Voltar para Loja
            </button>

            <button
              onClick={() => navigate('/finalizar-compra')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}

