// Catalogo.jsx
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

function Catalogo({ produtos }) {
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || [];
    setCarrinho(carrinhoSalvo);
  }, []);

  const salvarCarrinho = (novoCarrinho) => {
    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  };

  const adicionarAoCarrinho = (produto) => {
    const novoCarrinho = [...carrinho, produto];
    salvarCarrinho(novoCarrinho);
    toast.success(`✅ ${produto.nome} adicionado ao carrinho!`);
  };

  const isPorKilo = (produto) => {
    const nome = produto.nome.toLowerCase();
    return !nome.includes("geleia") && !nome.includes("doce");
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <motion.div
            key={produto.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-[400px] overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-[160px] object-cover"
            />

            <div className="flex flex-col flex-grow p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{produto.nome}</h3>

              <p className="text-sm text-gray-500 flex-grow overflow-auto">
                {isPorKilo(produto)
                  ? "Preço por quilo (Kg)"
                  : "Preço unitário"}
              </p>

              <p className="text-green-600 font-bold text-base mt-2">
                R$ {produto.preco.toFixed(2)}
              </p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => adicionarAoCarrinho(produto)}
                className="mt-auto bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} />
                Adicionar ao Carrinho
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;


