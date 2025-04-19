import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Admin from './pages/Admin';
import QuemSomos from './pages/QuemSomos';
import CategoriaCard from './components/CategoriaCard';
import ModalProdutos from './components/ModalProdutos';
import './App.css';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [exibirTelaProduto, setExibirTelaProduto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'produtos'));
        const listaProdutos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProdutos(listaProdutos);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
    buscarProdutos();
  }, []);

  const abrirProdutosPorCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);
    setExibirTelaProduto(true);
  };

  const fecharModal = () => setExibirTelaProduto(false);

  const adicionarAoCarrinho = (produto, quantidade) => {
    console.log(`Adicionado ao carrinho: ${quantidade}kg de ${produto.nome}`);
  };

  return (
    <Router>
      <div className="font-poppins relative">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-green-800">Armazém Dona Lourdes</h1>
          <nav className="space-x-4 text-green-800 font-semibold hidden md:flex">
            <a href="#hero" className="hover:text-green-600">Início</a>
            <a href="#sobre" className="hover:text-green-600">Quem Somos</a>
            <a href="#produtos" className="hover:text-green-600">Produtos</a>
            <a href="#local" className="hover:text-green-600">Onde Estamos</a>
            <a href="#contato" className="hover:text-green-600">Contato</a>
            <Link to="/admin" className="hover:text-green-600">Admin</Link>
          </nav>
        </header>

        <section id="hero" className="relative min-h-screen pt-20 flex flex-col md:flex-row items-center bg-gradient-to-r from-green-900 via-emerald-800 to-green-400">
          <div className="md:w-1/2 text-left animate-fade-in-up text-white px-4 md:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Alimentos locais, <br /> preços justos.
            </h2>
            <p className="text-lg mb-8">
              Do campo para sua mesa com muito carinho e cuidado.
            </p>
            <a href="#produtos" className="inline-block px-8 py-4 bg-white text-green-800 text-lg rounded-lg shadow hover:bg-green-100 transition">
              Ver produtos
            </a>
          </div>
          <img
            src="/caixa-frutas.png"
            alt="Caixa de frutas"
            className="absolute top-16 right-0 w-[30rem] md:w-[40rem] z-40 animate-float"
          />
        </section>

        <QuemSomos />

        <section id="produtos" className="px-8 py-20 bg-green-50 text-center">
          <h3 className="text-3xl font-bold text-green-900 mb-6">Nossos Produtos</h3>
          <p className="text-lg text-gray-700 max-w-xl mx-auto mb-10">
            Oferecemos frutas da estação, geleias caseiras, farinhas e muito mais direto de quem planta.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <CategoriaCard
              titulo="Cesta da Semana"
              descricao="Seleção de frutas e verduras fresquinhas."
              onClick={() => abrirProdutosPorCategoria('Cesta da Semana')}
            />
            <CategoriaCard
              titulo="Geleias & Doces"
              descricao="Produzidos com amor e sem conservantes."
              onClick={() => abrirProdutosPorCategoria('Geleias & Doces')}
            />
            <CategoriaCard
              titulo="Grãos & Farinhas"
              descricao="Direto dos moinhos da região."
              onClick={() => abrirProdutosPorCategoria('Grãos & Farinhas')}
            />
          </div>
        </section>

        {exibirTelaProduto && (
          <ModalProdutos
            produtos={produtos}
            categoriaSelecionada={categoriaSelecionada}
            fechar={fecharModal}
            adicionarAoCarrinho={adicionarAoCarrinho}
          />
        )}

        <section id="local" className="px-8 py-20 bg-white text-center">
          <h3 className="text-3xl font-bold text-green-900 mb-6">Onde Estamos</h3>
          <p className="text-lg text-gray-700 mb-6">
            Nosso ponto físico fica em Loanda, noroeste do Paraná. Venha nos visitar pessoalmente!
          </p>
          <div className="flex justify-center">
            <iframe
              title="Mapa de Loanda"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.859831291183!2d-53.134735!3d-22.927799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94938ecf5cf5cf1f%3A0x403b730c5c73ee0!2sLoanda%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1680000000000"
              width="600"
              height="450"
              className="max-w-full rounded-lg shadow-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>

        <section id="contato" className="px-8 py-20 bg-green-50 text-center">
          <h3 className="text-3xl font-bold text-green-900 mb-6">Fale Conosco</h3>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              Quer tirar dúvidas ou fazer um pedido? Entre em contato pelos canais abaixo:
            </p>
            <p className="text-xl text-green-800 font-semibold">📞 (44) 99999‑9999</p>
            <p className="text-xl text-green-800 font-semibold">📧 armazemdonalourdes@email.com</p>
            <p className="text-xl text-green-800 font-semibold">📍 Rua das Flores, 123 – Loanda – PR</p>
            <p className="text-lg text-gray-700 mt-4">Siga-nos:</p>
            <div className="flex justify-center space-x-6">
              <a
                href="https://www.facebook.com/armazemdonalourdes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/armazemdonalourdes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 font-semibold"
              >
                Instagram
              </a>
            </div>
          </div>
        </section>

        <footer className="bg-green-800 text-white text-center py-6">
          <p>&copy; {new Date().getFullYear()} Armazém Dona Lourdes. Todos os direitos reservados.</p>
        </footer>
      </div>

      <Routes>
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}