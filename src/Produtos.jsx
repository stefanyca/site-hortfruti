import React, { useState, useEffect } from "react";
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import Carrinho from './Carrinho';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [isOpen, setIsOpen] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantidades, setQuantidades] = useState({}); // Controlar quantidade por produto

  const adicionarAoCarrinho = (produto, quantidade) => {
    if (!quantidade || quantidade <= 0) return;
    const quantidadeNum = parseFloat(quantidade);
    const itemCarrinho = {
      ...produto,
      quantidade: quantidadeNum
    };
    setCarrinho((prevCarrinho) => {
      const indexExistente = prevCarrinho.findIndex(item => item.id === produto.id);
      if (indexExistente >= 0) {
        const novoCarrinho = [...prevCarrinho];
        novoCarrinho[indexExistente].quantidade += quantidadeNum;
        return novoCarrinho;
      } else {
        return [...prevCarrinho, itemCarrinho];
      }
    });
    // Resetar input após adicionar
    setQuantidades(prev => ({ ...prev, [produto.id]: '' }));
  };

  const fetchCategorias = async () => {
    const categoriasCollection = collection(db, 'categorias');
    const querySnapshot = await getDocs(categoriasCollection);
    const categoriasList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { nome: data.nome };
    });
    setCategorias(categoriasList);
  };

  const fetchProdutos = async () => {
    const produtosCollection = collection(db, 'produtos');
    const querySnapshot = await getDocs(produtosCollection);
    const produtosList = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        imagem: data.imagem,
        categoria: data.categoria,
        id: doc.id 
      };
    });
    setProdutos(produtosList);
  };

  useEffect(() => {
    fetchCategorias();
    fetchProdutos();
  }, []);

  const produtosFiltrados = selectedCategory
    ? produtos.filter((produto) => produto.categoria === selectedCategory)
    : produtos;

  const toggleSection = (section) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const removerDoCarrinho = (index) => {
    setCarrinho((prevCarrinho) => prevCarrinho.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-green-50 py-8">
      <div className="max-w-6xl mx-auto px-8">
        <h3 className="text-3xl font-bold text-green-900 mb-6">Escolha seus produtos</h3>

        {/* Dropdown de Categorias */}
        <div className="mb-6">
          <label htmlFor="categorias" className="block text-green-800 font-semibold mb-2">
            Escolha uma Categoria:
          </label>
          <select
            id="categorias"
            className="w-full p-3 border rounded"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria.nome}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Cesta da Semana */}
        <div>
          <button
            onClick={() => toggleSection("cestaDaSemana")}
            className="w-full bg-green-800 text-white py-3 mb-4 rounded-lg text-left font-semibold"
          >
            Cesta da Semana
          </button>
          {isOpen.cestaDaSemana && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {produtosFiltrados.length === 0 ? (
                <p>Carregando produtos...</p>
              ) : (
                produtosFiltrados.map((produto) => (
                  <div
                    key={produto.id}
                    className="p-4 bg-white rounded-lg shadow hover:scale-105 transition flex flex-col"
                    style={{ minHeight: '400px' }} // evita achatamento
                  >
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="w-full h-64 object-cover mb-4 rounded" // mais altura
                    />
                    <h4 className="font-semibold text-green-800 mb-2">{produto.nome}</h4>
                    <p className="text-gray-600 flex-grow">{produto.descricao}</p>
                    <p className="text-green-800 font-semibold mt-2 mb-4">
                      R$ {produto.preco.toFixed(2)} por kg
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Quantidade (kg)"
                        className="p-2 border rounded w-32"
                        value={quantidades[produto.id] || ''}
                        onChange={(e) =>
                          setQuantidades(prev => ({
                            ...prev,
                            [produto.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="px-6 py-2 bg-green-800 text-white rounded hover:bg-green-700 transition"
                        onClick={() => adicionarAoCarrinho(produto, quantidades[produto.id])}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Exibição do Carrinho */}
        <Carrinho carrinho={carrinho} removerDoCarrinho={removerDoCarrinho} />
      </div>
    </div>
  );
}
