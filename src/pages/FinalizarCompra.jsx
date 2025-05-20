import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importações do Firebase Firestore
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';  // Ajuste o caminho conforme seu projeto

export default function FinalizarCompra() {
  const navigate = useNavigate();

  const [carrinho, setCarrinho] = useState(() => {
    try {
      const data = localStorage.getItem('carrinho');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [erro, setErro] = useState('');
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [loading, setLoading] = useState(false); // Opcional: para indicar carregamento

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const codigoPIX = `00020126330014br.gov.bcb.pix0111156902979255204000053039865802BR5922Stefany Camily Da Cruz6009Sao Paulo62290525REC682B74362101084457587763045FE0`;
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(codigoPIX)}&size=200x200`;

  function validarFormulario() {
    if (!nome.trim()) return 'Informe seu nome completo.';
    if (!telefone.trim()) return 'Informe seu telefone.';
    if (!rua.trim()) return 'Informe o nome da rua.';
    if (!numero.trim()) return 'Informe o número.';
    if (!bairro.trim()) return 'Informe o bairro.';
    if (!cidade.trim()) return 'Informe a cidade.';
    if (!estado.trim()) return 'Informe o estado.';
    if (!cep.trim()) return 'Informe o CEP.';
    return '';
  }

  async function confirmarPedido() {
    const validacao = validarFormulario();
    if (validacao) {
      setErro(validacao);
      return;
    }
    setErro('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'pedidos'), {
        nome,
        telefone,
        endereco: { rua, numero, bairro, cidade, estado, cep },
        itens: carrinho,
        total,
        data: new Date(),
      });

      setPedidoConfirmado(true);
      localStorage.removeItem('carrinho');
    } catch (error) {
      setErro('Erro ao enviar pedido. Tente novamente.');
      console.error('Erro Firebase:', error);
    } finally {
      setLoading(false);
    }
  }

  if (pedidoConfirmado) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-green-50 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-green-800 mb-6 tracking-wide">
          Pedido Confirmado! 🍅🥬
        </h1>
        <p className="mb-8 text-green-900 text-lg leading-relaxed">
          Obrigado pela compra, <span className="font-semibold">{nome}</span>! <br />
          Em breve entraremos em contato para a entrega dos seus produtos fresquinhos.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-700 hover:bg-green-600 transition-colors text-white font-semibold py-3 px-8 rounded-full shadow-md"
        >
          Voltar à Loja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-green-10 rounded-lg shadow-md">
      <h1 className="text-3xl font-extrabold text-green-900 mb-10 tracking-wide text-center">
        Finalizar Compra
      </h1>

      <section className="mb-10 bg-green-50 p-6 rounded-lg shadow-inner border border-green-200">
        <h2 className="text-2xl font-semibold text-green-800 mb-5 border-b border-green-200 pb-2">
          Resumo do Pedido
        </h2>
        {carrinho.length === 0 ? (
          <p className="text-red-600 font-semibold text-center py-6">
            Seu carrinho está vazio.
          </p>
        ) : (
          <ul className="divide-y divide-green-200 max-h-64 overflow-y-auto">
            {carrinho.map(item => (
              <li
                key={item.id}
                className="flex justify-between py-3 items-center text-green-900 font-medium"
              >
                <div className="flex items-center gap-3">
                  {/* Pequena bolinha colorida para categoria */}
                  <span
                    className={`w-3 h-3 rounded-full ${
                      item.categoria === 'Geleias & Doces' ? 'bg-yellow-400' : 'bg-green-600'
                    }`}
                    aria-hidden="true"
                  ></span>
                  <span>
                    {item.nome} ({item.quantidade}{' '}
                    {item.categoria === 'Geleias & Doces' ? 'unidade(s)' : 'kg'})
                  </span>
                </div>
                <span className="font-semibold">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-right font-bold text-green-900 text-2xl mt-6">
          Total: R$ {total.toFixed(2)}
        </p>
      </section>

      <section className="mb-12 bg-green-50 p-6 rounded-lg shadow-inner border border-green-200">
        <h2 className="text-2xl font-semibold text-green-800 mb-5 border-b border-green-200 pb-2">
          Dados para Entrega
        </h2>
        {erro && (
          <p className="mb-6 text-red-600 font-semibold text-center bg-red-100 p-3 rounded">
            {erro}
          </p>
        )}
        <form
          onSubmit={e => {
            e.preventDefault();
            confirmarPedido();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-green-800" htmlFor="nome">
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="rounded border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-green-800" htmlFor="telefone">
              Telefone para contato
            </label>
            <input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              placeholder="(99) 99999-9999"
              className="rounded border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-green-800" htmlFor="rua">
              Rua
            </label>
            <input
              id="rua"
              type="text"
              value={rua}
              onChange={e => setRua(e.target.value)}
              className="rounded border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-green-800" htmlFor="numero">
              Número
            </label>
            <input
              id="numero"
              type="text"
              value={numero}
              onChange={e => setNumero(e.target.value)}
              className="rounded border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-green-800" htmlFor="bairro">
              Bairro
            </label>
            <input
              id="bairro"
              type="text"
              value={bairro}
              onChange={e => setBairro(e.target.value)}
              className="rounded border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-green-800" htmlFor="cidade">
              Cidade
            </label>
            <input
              id="cidade"
              type="text"
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              className="rounded border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-green-800" htmlFor="estado">
              Estado
            </label>
            <input
              id="estado"
              type="text"
              value={estado}
              onChange={e => setEstado(e.target.value)}
              placeholder="Ex: SP"
              maxLength={2}
              className="rounded border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-green-800" htmlFor="cep">
              CEP
            </label>
            <input
              id="cep"
              type="text"
              value={cep}
              onChange={e => setCep(e.target.value)}
              placeholder="Ex: 12345-678"
              className="rounded border border-green-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={carrinho.length === 0 || loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-full shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando pedido...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </section>

      <section className="text-center mt-12 bg-green-50 p-8 rounded-lg shadow-inner border border-green-200">
        <h2 className="text-2xl font-semibold text-green-800 mb-6 border-b border-green-200 pb-3">
          Pagamento via PIX
        </h2>
        <p className="mb-6 text-green-700 text-lg max-w-xl mx-auto">
          Use o QR Code abaixo para pagar o valor de{' '}
          <strong className="text-green-900">R$ {total.toFixed(2)}</strong> via PIX:
        </p>
        <img
          src={qrCodeURL}
          alt="QR Code PIX para pagamento"
          className="mx-auto mb-6 rounded-lg shadow-lg border-4 border-green-300"
        />
        <p className="text-sm text-green-900 break-words max-w-xl mx-auto font-mono select-all">
          {codigoPIX}
        </p>
      </section>
    </div>
  );
}
