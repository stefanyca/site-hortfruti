const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// Substitua pelo seu Access Token do Mercado Pago
mercadopago.configure({
  access_token: 'SEU_ACCESS_TOKEN'
});

app.post('/criar-pagamento-pix', async (req, res) => {
  const { itens, cliente } = req.body;

  const items = itens.map(item => ({
    title: item.nome,
    quantity: item.quantidade,
    unit_price: item.preco,
  }));

  const preference = {
    transaction_amount: items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0),
    description: 'Pagamento Armazém Dona Lourdes',
    payment_method_id: 'pix',
    payer: {
      email: cliente.email,
      first_name: cliente.nome,
    }
  };

  try {
    const payment = await mercadopago.payment.create(preference);
    const qr = payment.body.point_of_interaction.transaction_data;

    res.json({
      qr_code_base64: qr.qr_code_base64,
      qr_code: qr.qr_code,
    });
  } catch (err) {
    console.error('Erro ao criar pagamento:', err);
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
});

app.listen(3001, () => {
  console.log('Servidor backend rodando na porta 3001');
});
