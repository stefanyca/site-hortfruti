import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FinalizarCompra() {
  const navigate = useNavigate();

  // Simula carrinho vindo do localStorage (ou pode vir de contexto/global state)
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

  const total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  // Código PIX fornecido pelo usuário
  const codigoPIX = `00020126330014br.gov.bcb.pix0111156902979255204000053039865802BR5922Stefany Camily Da Cruz6009Sao Paulo62290525REC682B74362101084457587763045FE0`;

  // Link para QR Code via API do gerador online:
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

  function confirmarPedido() {
    const validacao = validarFormulario();
    if (validacao) {
      setErro(validacao);
      return;
    }
    setErro('');
    // Aqui você pode implementar o envio para backend, salvar pedido no banco, etc.
    setPedidoConfirmado(true);
    localStorage.removeItem('carrinho'); // limpa o carrinho
  }

  if (pedidoConfirmado) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-12 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Pedido Confirmado!</h1>
        <p className="mb-6 text-green-900">Obrigado pela compra, {nome}! Em breve entraremos em contato para a entrega.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold"
        >
          Voltar à Loja
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-8">Finalizar Compra</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Resumo do Pedido</h2>
        {carrinho.length === 0 ? (
          <p className="text-red-600">Seu carrinho está vazio.</p>
        ) : (
          <ul className="mb-4">
            {carrinho.map(item => (
              <li key={item.id} className="flex justify-between py-2 border-b border-green-200">
                <span>
                  {item.nome} ({item.quantidade} {item.categoria === 'Geleias & Doces' ? 'unidade(s)' : 'kg'})
                </span>
                <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-right font-bold text-green-900 text-xl">
          Total: R$ {total.toFixed(2)}
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Dados para Entrega</h2>
        {erro && <p className="mb-4 text-red-600 font-semibold">{erro}</p>}
        <form
          onSubmit={e => {
            e.preventDefault();
            confirmarPedido();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block font-semibold mb-1" htmlFor="nome">
              Nome Completo
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full border border-green-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="telefone">
              Telefone para contato
            </label>
            <input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              className="w-full border border-green-300 rounded px-3 py-2"
              placeholder="(99) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="rua">
              Rua
            </label>
            <input
              id="rua"
              type="text"
              value={rua}
              onChange={e => setRua(e.target.value)}
              className="w-full border border-green-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="numero">
              Número
            </label>
            <input
              id="numero"
              type="text"
              value={numero}
              onChange={e => setNumero(e.target.value)}
              className="w-full border border-green-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="bairro">
              Bairro
            </label>
            <input
              id="bairro"
              type="text"
              value={bairro}
              onChange={e => setBairro(e.target.value)}
              className="w-full border border-green-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="cidade">
              Cidade
            </label>
            <input
              id="cidade"
              type="text"
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              className="w-full border border-green-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="estado">
              Estado
            </label>
            <input
              id="estado"
              type="text"
              value={estado}
              onChange={e => setEstado(e.target.value)}
              className="w-full border border-green-300 rounded px-3 py-2"
              placeholder="Ex: SP"
              maxLength={2}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1" htmlFor="cep">
              CEP
            </label>
            <input
              id="cep"
              type="text"
              value={cep}
              onChange={e => setCep(e.target.value)}
              className="w-full border border-green-300 rounded px-3 py-2"
              placeholder="Ex: 12345-678"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 rounded mt-4"
            disabled={carrinho.length === 0}
          >
            Confirmar Pedido
          </button>
        </form>
      </section>

      <section className="text-center mt-12">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Pagamento via PIX</h2>
        <p className="mb-4 text-green-700">
          Use o QR Code abaixo para pagar o valor de <strong>R$ {total.toFixed(2)}</strong> via PIX:
        </p>
        <img src={qrCodeURL} alt="QR Code PIX para pagamento" className="mx-auto mb-4" />
        <p className="text-sm text-green-900 break-all">{codigoPIX}</p>
      </section>
    </div>
  );
}
