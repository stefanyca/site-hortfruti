// src/pages/Admin.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { LogOut, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuario, setUsuario] = useState(null);

  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [descricao, setDescricao] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('produtos');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUsuario(user);
      if (user) {
        buscarProdutos();
        buscarPedidos();
      }
    });
    return unsubscribe;
  }, []);

  const fazerLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert('Login realizado!');
      setEmail('');
      setSenha('');
    } catch (error) {
      alert('Erro no login: ' + error.message);
    }
  };

  const fazerLogout = async () => {
    await signOut(auth);
    setUsuario(null);
    alert('Deslogado!');
  };

  const buscarProdutos = async () => {
    const snapshot = await getDocs(collection(db, 'produtos'));
    const lista = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setProdutos(lista);
  };

  const buscarPedidos = async () => {
    const q = query(collection(db, 'pedidos'), orderBy('data', 'desc'));
    const snapshot = await getDocs(q);
    const listaPedidos = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    setPedidos(listaPedidos);
  };

  const marcarComoEnviado = async (id, enviadoAtual) => {
    try {
      const ref = doc(db, 'pedidos', id);
      await updateDoc(ref, { enviado: !enviadoAtual });
      setPedidos(prev =>
        prev.map(p => p.id === id ? { ...p, enviado: !enviadoAtual } : p)
      );
    } catch (err) {
      alert('Erro ao atualizar status do pedido: ' + err.message);
    }
  };

  const cadastrarProduto = async (e) => {
    e.preventDefault();
    if (!nome || !preco || !categoria || !imagemUrl.trim() || !descricao.trim()) {
      return alert('Preencha todos os campos!');
    }

    const novoProduto = {
      nome,
      preco: parseFloat(preco),
      categoria,
      imagem: imagemUrl.trim(),
      descricao: descricao.trim(),
    };

    try {
      await addDoc(collection(db, 'produtos'), novoProduto);
      alert('Produto cadastrado com sucesso!');
      setNome('');
      setPreco('');
      setCategoria('');
      setImagemUrl('');
      setDescricao('');
      buscarProdutos();
    } catch (err) {
      alert('Erro ao cadastrar produto: ' + err.message);
    }
  };

  const deletarProduto = async (id) => {
    if (!window.confirm('Confirma exclusão?')) return;
    try {
      await deleteDoc(doc(db, 'produtos', id));
      setProdutos(produtos.filter(p => p.id !== id));
      alert('Produto excluído.');
    } catch (err) {
      alert('Erro ao excluir.');
    }
  };

  if (!usuario) {
    return (
      <div className="max-w-md mx-auto mt-40 bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-green-700 mb-6">Login do Administrador</h2>
        <form onSubmit={fazerLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full border border-gray-300 px-4 py-2 rounded"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Entrar
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="/" className="text-green-600 hover:underline text-sm">
            ← Voltar para o site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 mt-12 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-green-800">Painel Administrativo</h2>
        <button
          onClick={fazerLogout}
          className="flex items-center gap-1 text-red-600 hover:underline text-sm"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>

      <nav className="mb-8 border-b border-green-300 flex space-x-8 text-lg">
        <button
          onClick={() => setAbaAtiva('produtos')}
          className={`pb-2 font-semibold ${abaAtiva === 'produtos' ? 'border-b-4 border-green-700 text-green-700' : 'text-gray-500'}`}
        >
          Produtos
        </button>
        <button
          onClick={() => setAbaAtiva('clientes')}
          className={`pb-2 font-semibold ${abaAtiva === 'clientes' ? 'border-b-4 border-green-700 text-green-700' : 'text-gray-500'}`}
        >
          Clientes / Pedidos
        </button>
      </nav>

      {abaAtiva === 'produtos' && (
        <>
          {/* FORMULÁRIO */}
          <form onSubmit={cadastrarProduto} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <input type="text" placeholder="Nome do produto" className="border px-4 py-2 rounded" value={nome} onChange={e => setNome(e.target.value)} />
            <input type="number" step="0.01" placeholder="Preço" className="border px-4 py-2 rounded" value={preco} onChange={e => setPreco(e.target.value)} />
            <select className="border px-4 py-2 rounded" value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="">Selecione uma categoria</option>
              <option value="Cesta da Semana">Cesta da Semana</option>
              <option value="Geleias & Doces">Geleias & Doces</option>
              <option value="Grãos & Farinhas">Grãos & Farinhas</option>
            </select>
            <input type="text" placeholder="URL da imagem" className="border px-4 py-2 rounded" value={imagemUrl} onChange={e => setImagemUrl(e.target.value)} />
            <textarea placeholder="Descrição" className="border px-4 py-2 rounded col-span-full" value={descricao} onChange={e => setDescricao(e.target.value)} />
            <button type="submit" className="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Cadastrar Produto
            </button>
          </form>

          {/* PRODUTOS */}
          <h3 className="text-xl font-semibold mb-4 text-green-700">Produtos Cadastrados</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map(prod => (
              <div key={prod.id} className="border rounded-lg p-4 bg-gray-50 shadow-sm relative">
                <h4 className="font-semibold text-lg text-green-800">{prod.nome}</h4>
                <p className="text-sm text-gray-600">R$ {prod.preco.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mb-2">{prod.categoria}</p>
                <p className="text-gray-700 text-sm mb-2">{prod.descricao}</p>
                <button
                  onClick={() => deletarProduto(prod.id)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {abaAtiva === 'clientes' && (
        <>
          <h3 className="text-xl font-semibold mb-4 text-green-700">Pedidos Recebidos</h3>
          <div className="space-y-6">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="border rounded-lg p-5 bg-green-50 shadow-sm">
                <p><strong>Nome:</strong> {pedido.nome}</p>
                <p><strong>Telefone:</strong> {pedido.telefone}</p>
                <p><strong>Endereço:</strong> {pedido.endereco?.rua}, {pedido.endereco?.numero} - {pedido.endereco?.bairro}, {pedido.endereco?.cidade} - {pedido.endereco?.estado}, CEP: {pedido.endereco?.cep}</p>
                <p className="mt-2"><strong>Itens:</strong></p>
                <ul className="list-disc list-inside ml-4 text-sm">
                  {pedido.itens?.map((item, i) => (
                    <li key={i}>{item.nome} x {item.quantidade}</li>
                  ))}
                </ul>
                <p className="mt-2"><strong>Total:</strong> R$ {pedido.total?.toFixed(2)}</p>
                <p className="text-sm text-gray-600 italic">Data do pedido: {pedido.data?.toDate ? pedido.data.toDate().toLocaleString() : new Date(pedido.data).toLocaleString()}</p>

                <p className="mt-2">
                  <strong>Status:</strong>{' '}
                  {pedido.enviado ? (
                    <span className="text-green-600 font-semibold inline-flex items-center gap-1"><CheckCircle size={16} /> Enviado</span>
                  ) : (
                    <span className="text-yellow-600 font-semibold inline-flex items-center gap-1"><AlertCircle size={16} /> Pendente</span>
                  )}
                </p>

                <button
                  onClick={() => marcarComoEnviado(pedido.id, pedido.enviado)}
                  className={`mt-2 px-4 py-1 rounded text-white text-sm ${
                    pedido.enviado ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {pedido.enviado ? 'Marcar como Pendente' : 'Marcar como Enviado'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
