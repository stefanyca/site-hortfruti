import React from 'react';
import QRCode from 'qrcode.react';

const PixQRCode = () => {
  const pixPayload = "00020126330014br.gov.bcb.pix0111156902979255204000053039865802BR5922Stefany Camily Da Cruz6009Sao Paulo62290525REC682B74362101084457587763045FE0";

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Pagamento via PIX</h2>
      <QRCode value={pixPayload} size={256} />
      <p>Escaneie o QR Code acima para pagar</p>
    </div>
  );
};

export default PixQRCode;
