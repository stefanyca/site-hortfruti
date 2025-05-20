import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Loja() {
  const [produtos, setProdutos] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [busca, setBusca] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [carrinho, setCarrinho] = useState(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  });
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeInput, setQuantidadeInput] = useState('');

  const navigate = useNavigate();

  const banners = [
    {
      imagem: '/banners/banner1.png',
      texto: 'Promoção Cesta da Semana! Produtos fresquinhos direto do produtor.',
    },
    {
      imagem: '/banners/banner2.png',
      texto: 'Geleias caseiras sem conservantes, aproveite!',
    },
    {
      imagem: '/banners/banner3.png',
      texto: 'Grãos e farinhas com qualidade e preço especial!',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % banners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const snapshot = await getDocs(collection(db, 'produtos'));
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProdutos(lista);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    }
    buscarProdutos();
  }, []);

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  const produtosFiltrados = produtos.filter(p => {
    const matchCategoria = categoriaFiltro ? p.categoria === categoriaFiltro : true;
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const abrirModalQuantidade = (produto) => {
    setProdutoSelecionado(produto);
    setQuantidadeInput('');
    setModalAberto(true);
  };

  const adicionarAoCarrinho = (produto, quantidade) => {
    if (quantidade <= 0 || isNaN(quantidade)) {
      alert('Quantidade inválida!');
      return;
    }
    setCarrinho(prev => {
      const existe = prev.find(item => item.id === produto.id);
      if (existe) {
        return prev.map(item =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + quantidade } : item
        );
      }
      return [...prev, { ...produto, quantidade }];
    });
    setModalAberto(false);
  };

  const removerDoCarrinho = (id) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  const totalCarrinho = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const voltarPaginaInicial = () => {
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Banners rotativos */}
      <div className="relative h-52 md:h-72 rounded-lg overflow-hidden shadow-lg mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={bannerIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={banners[bannerIndex].imagem}
              alt="Banner promocional"
              className="w-full h-full object-cover brightness-75"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <h2 className="text-white text-3xl md:text-5xl font-bold text-center drop-shadow-lg">
                {banners[bannerIndex].texto}
              </h2>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex flex-wrap gap-2">
          {['', 'Cesta da Semana', 'Geleias & Doces', 'Grãos & Farinhas'].map(categoria => (
            <button
              key={categoria}
              onClick={() => setCategoriaFiltro(categoria)}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                categoriaFiltro === categoria
                  ? 'bg-green-700 text-white'
                  : 'bg-green-200 text-green-900'
              }`}
            >
              {categoria === '' ? 'Todos' : categoria}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Buscar produto..."
          className="border border-green-300 rounded-md px-4 py-2 w-full md:w-64"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          aria-label="Buscar produtos"
        />
      </div>

      {/* Lista de produtos */}
      <div className="flex flex-col gap-6">
        {produtosFiltrados.map(produto => (
          <motion.article
            key={produto.id}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(34,197,94,0.15)' }}
            className="flex bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            tabIndex={0}
            role="button"
            onClick={() => abrirModalQuantidade(produto)}
            onKeyDown={e => e.key === 'Enter' && abrirModalQuantidade(produto)}
            aria-label={`Adicionar ${produto.nome} ao carrinho`}
          >
            {produto.imagem ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="w-40 h-40 object-cover flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="w-40 h-40 bg-green-200 flex items-center justify-center text-green-700 font-semibold flex-shrink-0">
                Sem imagem
              </div>
            )}
            <div className="flex flex-col justify-between flex-grow p-4 min-h-[160px] relative">
              <div>
                <h3 className="text-green-900 font-semibold text-xl mb-2">{produto.nome}</h3>
                <p className="text-green-700">{produto.descricao || 'Descrição não disponível.'}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-bold text-green-900 text-lg">
                  R$ {produto.preco.toFixed(2)} {produto.categoria === 'Geleias & Doces' ? 'por unidade' : 'por kg'}
                </p>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    abrirModalQuantidade(produto);
                  }}
                  className="bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition z-10 relative"
                  aria-label={`Adicionar ${produto.nome} ao carrinho`}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Modal quantidade */}
      <AnimatePresence>
        {modalAberto && produtoSelecionado && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalAberto(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-sm"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <h3 id="modal-title" className="text-green-900 font-bold text-xl mb-4">
                Quantidade de {produtoSelecionado.nome}
              </h3>
              <label className="block mb-2 font-semibold text-green-800">
                Informe a quantidade ({produtoSelecionado.categoria === 'Geleias & Doces' ? 'unidades' : 'kg'}):
              </label>
              <input
                type="number"
                min="0"
                step={produtoSelecionado.categoria === 'Geleias & Doces' ? '1' : '0.1'}
                value={quantidadeInput}
                onChange={e => setQuantidadeInput(e.target.value)}
                className="border border-green-300 rounded px-3 py-2 w-full mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const qtd = produtoSelecionado.categoria === 'Geleias & Doces'
                      ? parseInt(quantidadeInput)
                      : parseFloat(quantidadeInput);
                    adicionarAoCarrinho(produtoSelecionado, qtd);
                  }}
                  className="px-4 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-semibold"
                >
                  Adicionar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carrinho */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg border-l border-green-200 p-6 flex flex-col transition-transform duration-300 z-50
          ${carrinhoAberto ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!carrinhoAberto}
        role="region"
        aria-label="Carrinho de compras"
      >
        <h2 className="text-2xl font-bold mb-4 text-green-900">Carrinho</h2>
        {carrinho.length === 0 ? (
          <p className="text-green-700">Seu carrinho está vazio.</p>
        ) : (
          <ul className="flex-grow overflow-auto space-y-4">
            {carrinho.map(item => (
              <li key={item.id} className="flex justify-between items-center border-b border-green-100 pb-2">
                <div>
                  <h3 className="font-semibold text-green-900">{item.nome}</h3>
                  <p className="text-green-700">
                    Quantidade: {item.quantidade} {item.categoria === 'Geleias & Doces' ? 'unidade(s)' : 'kg'}
                  </p>
                  <p className="font-bold text-green-900">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removerDoCarrinho(item.id)}
                  className="text-red-600 font-semibold hover:text-red-700"
                  aria-label={`Remover ${item.nome} do carrinho`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 border-t border-green-200 pt-4">
          <p className="font-bold text-lg text-green-900">Total: R$ {totalCarrinho.toFixed(2)}</p>
        </div>
        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={voltarPaginaInicial}
            className="flex-1 bg-gray-300 hover:bg-gray-400 rounded px-4 py-2 font-semibold"
          >
            Voltar ao Início
          </button>
          <button
            onClick={() => {
              if (carrinho.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
              }
              navigate('/finalizar-compra');
            }}
            className="flex-1 bg-green-700 hover:bg-green-600 rounded px-4 py-2 font-semibold text-white"
          >
            Finalizar Compra
          </button>
        </div>
        <button
          onClick={() => setCarrinhoAberto(false)}
          aria-label="Fechar carrinho"
          className="absolute top-3 right-3 text-green-700 hover:text-green-900 font-bold text-xl"
        >
          ×
        </button>
      </div>

      {/* Botão fixo para abrir carrinho */}
      <button
        onClick={() => setCarrinhoAberto(true)}
        aria-label="Abrir carrinho de compras"
        className="fixed bottom-6 right-6 bg-green-700 hover:bg-green-600 text-white rounded-full p-4 shadow-lg text-xl z-40"
      >
        🛒 {carrinho.length > 0 && <span className="ml-1 font-bold">{carrinho.length}</span>}
      </button>
    </div>
  );
}
