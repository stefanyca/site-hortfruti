import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContent from './components/MainContent'; // Página inicial
import SecaoLoja from './pages/Loja';
import CarrinhoPage from './pages/CarrinhoPage';
import FinalizarCompra from './pages/FinalizarCompra';
import Admin from './pages/Admin';

function App() {
  const [carrinho, setCarrinho] = useState([]);

  function adicionarAoCarrinho(produto) {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => item.id === produto.id);
      if (itemExistente) {
        return prev.map(item =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + produto.quantidade } : item
        );
      }
      return [...prev, produto];
    });
  }

  function removerDoCarrinho(id) {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/loja" element={<SecaoLoja adicionarAoCarrinho={adicionarAoCarrinho} />} />
        <Route
          path="/carrinho"
          element={
            <CarrinhoPage
              carrinho={carrinho}
              removerDoCarrinho={removerDoCarrinho}
              setCarrinho={setCarrinho}
            />
          }
        />
        <Route
          path="/finalizar-compra"
          element={
            <FinalizarCompra
              carrinho={carrinho}
              setCarrinho={setCarrinho}
            />
          }
        />
        {/* Rota para admin */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
