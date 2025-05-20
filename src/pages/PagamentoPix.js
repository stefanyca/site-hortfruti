import React from 'react';

export default function Pagamento() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Pagamento via Pix</h1>
      <p className="mb-4">Use o QR Code abaixo ou copie a chave Pix para finalizar o pagamento.</p>
      <img
        src="/qrcode-pix-exemplo.png" // coloque seu QR code real aqui
        alt="QR Code Pix"
        className="w-64 h-64 mx-auto mb-4"
      />
      <p className="text-center text-sm text-gray-600">Chave Pix: exemplo@pix.com.br</p>
    </div>
  );
}
