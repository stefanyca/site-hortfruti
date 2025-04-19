import { createContext, useState } from "react";

export const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);

  function adicionarAoCarrinho(produto) {
    setCarrinho((prev) => [...prev, produto]);
  }

  function removerDoCarrinho(id) {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  }

  function limparCarrinho() {
    setCarrinho([]);
  }

  const valorTotal = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho, valorTotal }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}