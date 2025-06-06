import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importações do Firebase Firestore
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';  // Ajuste o caminho conforme seu projeto

export default function FinalizarCompra() {
  const navigate = useNavigate();

  const [carrinho] = useState(() => {
    try {
      const data = localStorage.getItem('carrinho');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // Dados do endereço
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');

  // Dados do cartão (quando método é cartão)
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [validadeCartao, setValidadeCartao] = useState('');
  const [cvvCartao, setCvvCartao] = useState('');

  // Estado do método de pagamento
  const [metodoPagamento, setMetodoPagamento] = useState('pix');

  // Estados auxiliares
  const [erro, setErro] = useState('');
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cálculo do subtotal dos produtos
  const totalProdutos = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  // Cálculo do frete: grátis para cidade "Loanda" (ignorar caixa)
  const [frete, setFrete] = useState(0);

  useEffect(() => {
    if (cidade.trim().toLowerCase() === 'loanda') {
      setFrete(0);
    } else if (cidade.trim()) {
      setFrete(20.0); // Exemplo de frete fixo para outras cidades
    } else {
      setFrete(0); // Sem cidade definida, frete 0 para não atrapalhar
    }
  }, [cidade]);

  // Total com frete
  const total = totalProdutos + frete;

  // Código PIX e QR Code (fixo para o exemplo)
  const codigoPIX = `00020126330014br.gov.bcb.pix0111156902979255204000053039865802BR5922Stefany Camily Da Cruz6009Sao Paulo62290525REC682B74362101084457587763045FE0`;
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(codigoPIX)}&size=200x200`;

  // Função para validar formulário e pagamento
  function validarFormulario() {
    if (!nome.trim()) return 'Informe seu nome completo.';
    if (!telefone.trim()) return 'Informe seu telefone.';
    if (!rua.trim()) return 'Informe o nome da rua.';
    if (!numero.trim()) return 'Informe o número.';
    if (!bairro.trim()) return 'Informe o bairro.';
    if (!cidade.trim()) return 'Informe a cidade.';
    if (!estado.trim()) return 'Informe o estado.';
    if (!cep.trim()) return 'Informe o CEP.';

    if (metodoPagamento === 'cartao') {
      if (!numeroCartao.trim()) return 'Informe o número do cartão.';
      if (!nomeCartao.trim()) return 'Informe o nome no cartão.';
      
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(validadeCartao.trim())) {
        return 'Informe a validade do cartão no formato MM/AA.';
      }
      
      if (!/^\d{3,4}$/.test(cvvCartao.trim())) {
        return 'Informe o CVV do cartão com 3 ou 4 dígitos.';
      }
    }

    return '';
  }

  // Função para confirmar pedido (salvar no Firestore)
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
        frete,
        pagamento: metodoPagamento,
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

      {/* Resumo do Pedido */}
      <section className="mb-10 bg-green-50 p-6 rounded-lg shadow-inner border border-green-200">
        <h2 className="text-2xl font-semibold text-green-800 mb-5 border-b border-green-200 pb-2">
          Resumo do Pedido
        </h2>
        {carrinho.length === 0 ? (
          <p className="text-green-900 font-semibold">Seu carrinho está vazio.</p>
        ) : (
          <table className="w-full text-green-900">
            <thead>
              <tr className="border-b border-green-300">
                <th className="text-left py-2">Produto</th>
                <th className="text-center py-2">Qtd</th>
                <th className="text-right py-2">Preço Unit.</th>
                <th className="text-right py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrinho.map((item, index) => (
                <tr key={index} className="border-b border-green-100">
                  <td className="py-2">{item.nome}</td>
                  <td className="text-center py-2">{item.quantidade}</td>
                  <td className="text-right py-2">R$ {item.preco.toFixed(2)}</td>
                  <td className="text-right py-2">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="text-right font-semibold py-2">
                  Subtotal
                </td>
                <td className="text-right font-semibold py-2">
                  R$ {totalProdutos.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-green-700 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md"
        >
          Voltar ao Carrinho
        </button>
      </section>

      {/* Formulário de endereço */}
      <section className="bg-green-50 p-6 rounded-lg shadow-inner border border-green-200">
        <h2 className="text-2xl font-semibold text-green-800 mb-5 border-b border-green-200 pb-2">
          Endereço de Entrega
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded border border-green-300 px-4 py-2"
          />
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="rounded border border-green-300 px-4 py-2"
          />
          <input
            type="text"
            placeholder="Rua"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            className="rounded border border-green-300 px-4 py-2"
          />
          <input
            type="text"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="rounded border border-green-300 px-4 py-2"
          />
          <input
            type="text"
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            className="rounded border border-green-300 px-4 py-2"
          />
          <input
            type="text"
            placeholder="Cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="rounded border border-green-300 px-4 py-2"
          />
          <input
            type="text"
            placeholder="Estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="rounded border border-green-300 px-4 py-2"
          />
          <input
            type="text"
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="rounded border border-green-300 px-4 py-2"
          />
        </div>
      </section>

      {/* Método de pagamento */}
      <section className="bg-green-50 p-6 rounded-lg shadow-inner border border-green-200 mt-6">
        <h2 className="text-2xl font-semibold text-green-800 mb-5 border-b border-green-200 pb-2">
          Método de Pagamento
        </h2>

        <div className="mb-4 flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="pagamento"
              value="pix"
              checked={metodoPagamento === 'pix'}
              onChange={() => setMetodoPagamento('pix')}
              className="cursor-pointer"
            />
            PIX
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="pagamento"
              value="cartao"
              checked={metodoPagamento === 'cartao'}
              onChange={() => setMetodoPagamento('cartao')}
              className="cursor-pointer"
            />
            Cartão (Fictício)
          </label>
        </div>

        {metodoPagamento === 'pix' && (
          <div className="text-center">
            <p className="mb-4 font-semibold text-green-900">
              Use o código PIX abaixo para realizar o pagamento:
            </p>
            <img src={qrCodeURL} alt="QRCode PIX" className="mx-auto mb-2" />
            <p className="break-words font-mono text-green-800 select-all">{codigoPIX}</p>
          </div>
        )}

        {metodoPagamento === 'cartao' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              placeholder="Número do cartão"
              value={numeroCartao}
              onChange={(e) => setNumeroCartao(e.target.value)}
              className="rounded border border-green-300 px-4 py-2"
              maxLength={19}
              inputMode="numeric"
            />
            <input
              type="text"
              placeholder="Nome no cartão"
              value={nomeCartao}
              onChange={(e) => setNomeCartao(e.target.value)}
              className="rounded border border-green-300 px-4 py-2"
            />
            <input
              type="text"
              placeholder="Validade (MM/AA)"
              value={validadeCartao}
              onChange={(e) => setValidadeCartao(e.target.value)}
              className="rounded border border-green-300 px-4 py-2"
              maxLength={5}
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvvCartao}
              onChange={(e) => setCvvCartao(e.target.value)}
              className="rounded border border-green-300 px-4 py-2"
              maxLength={4}
              inputMode="numeric"
            />
          </div>
        )}
      </section>

      {/* Erro */}
      {erro && (
        <div className="mt-6 bg-red-200 border border-red-400 text-red-800 px-6 py-4 rounded">
          {erro}
        </div>
      )}

      {/* Total e botão */}
      <section className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-2xl font-bold text-green-900">
          Total: R$ {total.toFixed(2)}{' '}
          <span className="text-sm font-normal text-green-700">(Inclui frete)</span>
        </p>

        <button
          onClick={confirmarPedido}
          disabled={loading || carrinho.length === 0}
          className={`bg-green-700 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors ${
            loading || carrinho.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Confirmando...' : 'Confirmar Pedido'}
        </button>
      </section>
    </div>
  );
}
