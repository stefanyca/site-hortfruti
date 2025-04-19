// Carrinho.jsx
import React from "react";

export default function Carrinho({ carrinho, removerDoCarrinho }) {
  if (carrinho.length === 0) {
    return <p>O carrinho está vazio!</p>;
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-green-900 mb-4">Itens no Carrinho</h3>
      <div>
        {carrinho.map((item, index) => (
          <div key={index} className="flex justify-between items-center bg-white p-4 mb-4 rounded-lg shadow">
            <div>
              <p className="font-semibold text-green-800">{item.nome}</p>
              <p className="text-gray-600">Quantidade: {item.quantidade} kg</p>
              <p className="text-green-800 font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
            </div>
            <button
              onClick={() => removerDoCarrinho(index)} // Remove o item
              className="text-red-500 hover:text-red-700"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => alert('Finalizando compra!')}
        className="w-full bg-green-800 text-white py-3 mt-4 rounded-lg"
      >
        Finalizar Compra
      </button>
    </div>
  );
}
