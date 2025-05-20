import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode salvar os dados, validar etc.
    navigate('/pagamento'); // redireciona para a página de pagamento
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Cadastro do Cliente</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input className="border px-4 py-2 rounded" type="text" placeholder="Nome completo" required />
        <input className="border px-4 py-2 rounded" type="email" placeholder="E-mail" required />
        <input className="border px-4 py-2 rounded" type="tel" placeholder="Telefone" required />
        <input className="border px-4 py-2 rounded" type="text" placeholder="Endereço de entrega" required />
        <button className="bg-green-700 text-white py-2 rounded hover:bg-green-600 transition">
          Avançar para pagamento
        </button>
      </form>
    </div>
  );
}
