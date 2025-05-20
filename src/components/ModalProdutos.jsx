import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function ModalProdutos({
  produtos,
  categoriaSelecionada,
  fechar,
  adicionarAoCarrinho
}) {
  const produtosFiltrados = categoriaSelecionada
    ? produtos.filter(p => p.categoria === categoriaSelecionada)
    : produtos;

  const handleAdicionar = (produto, quantidade) => {
    if (quantidade <= 0) {
      toast.error('Quantidade inválida.');
      return;
    }
    adicionarAoCarrinho(produto, quantidade);
    const unidade = (produto.categoria === 'Geleias' || produto.categoria === 'Doces') ? 'unidade(s)' : 'kg(s)';
    toast.success(`${quantidade} ${unidade} de ${produto.nome} adicionado ao carrinho!`);
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* Fundo escurecido */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
        onClick={fechar}
        aria-label="Fechar modal"
      />

      {/* Modal principal com animação */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
        >
          {/* Botão de fechar */}
          <button
            onClick={fechar}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-3xl font-bold"
            aria-label="Fechar modal"
          >
            &times;
          </button>

          <h2 className="text-3xl font-bold mb-6 text-green-800 text-center">
            Produtos - {categoriaSelecionada || 'Todas as Categorias'}
          </h2>

          {produtosFiltrados.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum produto encontrado.</p>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{ gridAutoRows: '1fr' }}
            >
              {produtosFiltrados.map(produto => (
                <ProdutoCard
                  key={produto.id}
                  produto={produto}
                  aoAdicionar={handleAdicionar}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

function ProdutoCard({ produto, aoAdicionar }) {
  const [quantidade, setQuantidade] = useState(1);
  const precoTotal = (quantidade * produto.preco).toFixed(2);
  const unidade = (produto.categoria === 'Geleias' || produto.categoria === 'Doces') ? 'unidade' : 'kg';

  return (
    <div className="border rounded-xl p-4 flex flex-col bg-green-50 shadow-md h-full min-h-[420px]">
      {produto.imagemUrl && (
        <img
          src={produto.imagemUrl}
          alt={produto.nome}
          className="w-full h-32 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-xl font-semibold text-green-900 mb-1">{produto.nome}</h3>

      <p className="text-gray-700 text-sm mb-2 flex-grow overflow-auto">
        {produto.descricao}
      </p>

      <p className="text-green-700 font-bold">R$ {produto.preco.toFixed(2)} / {unidade}</p>

      <div className="flex items-center justify-between mt-4">
        <label className="text-sm font-medium">Quantidade:</label>
        <input
          type="number"
          min="1"
          value={quantidade}
          onChange={e => setQuantidade(Number(e.target.value))}
          className="w-16 text-center border rounded px-2 py-1"
        />
      </div>

      <p className="mt-2 text-sm text-gray-800">
        Total: <span className="font-semibold">R$ {precoTotal}</span>
      </p>

      {/* Botão com animação ao clicar */}
      <motion.button
        onClick={() => aoAdicionar(produto, quantidade)}
        whileTap={{ scale: 0.9 }}
        className="mt-auto bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg transition"
      >
        Adicionar ao carrinho
      </motion.button>
    </div>
  );
}






