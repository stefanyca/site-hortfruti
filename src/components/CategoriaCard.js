import React from 'react';

export default function CategoriaCard({ titulo, descricao, onClick }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow hover:scale-105 transition" onClick={onClick}>
      <h4 className="font-semibold text-green-800 mb-2">{titulo}</h4>
      <p className="text-gray-600">{descricao}</p>
    </div>
  );
}
