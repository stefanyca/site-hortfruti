// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function Admin() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [produtos, setProdutos] = useState([]);

  // Busca os produtos já cadastrados
  const buscarProdutos = async () => {
    const snapshot = await getDocs(collection(db, 'produtos'));
    const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setProdutos(lista);
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  // Cadastra usando URL de imagem
  const cadastrarProduto = async (e) => {
    e.preventDefault();
    if (!nome || !preco || !categoria || !imagemUrl) {
      return alert('Preencha todos os campos e informe a URL da imagem.');
    }

    try {
      await addDoc(collection(db, 'produtos'), {
        nome,
        preco: parseFloat(preco),
        categoria,
        imagem: imagemUrl.trim(),
      });
      alert('Produto cadastrado com sucesso!');
      // limpa formulário
      setNome('');
      setPreco('');
      setCategoria('');
      setImagemUrl('');
      buscarProdutos();
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar produto.');
    }
  };

  // Exclui sem recarregar a página
  const deletarProduto = async (id) => {
    if (!window.confirm('Confirma exclusão?')) return;
    try {
      await deleteDoc(doc(db, 'produtos', id));
      setProdutos(produtos.filter(p => p.id !== id));
      alert('Produto excluído.');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 mt-24 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Cadastro de Produtos</h2>

      <form onSubmit={cadastrarProduto} className="space-y-4">
        <input
          type="text"
          placeholder="Nome do produto"
          className="w-full border px-3 py-2 rounded"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Preço (ex: 12.50)"
          className="w-full border px-3 py-2 rounded"
          value={preco}
          onChange={e => setPreco(e.target.value)}
        />
        <select
          className="w-full border px-3 py-2 rounded"
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          <option value="Cesta da Semana">Cesta da Semana</option>
          <option value="Geleias & Doces">Geleias & Doces</option>
          <option value="Grãos & Farinhas">Grãos & Farinhas</option>
        </select>
        <input
          type="url"
          placeholder="URL da imagem"
          className="w-full border px-3 py-2 rounded"
          value={imagemUrl}
          onChange={e => setImagemUrl(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Cadastrar Produto
        </button>
      </form>

      <hr className="my-8" />

      <h3 className="text-xl font-semibold mb-4 text-green-700">Produtos Cadastrados</h3>
      {produtos.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <ul className="space-y-3">
          {produtos.map(prod => (
            <li key={prod.id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <div>
                <p className="font-medium">{prod.nome}</p>
                <p className="text-sm text-gray-600">
                  R$ {prod.preco.toFixed(2)} – {prod.categoria}
                </p>
              </div>
              <button
                onClick={() => deletarProduto(prod.id)}
                className="text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
