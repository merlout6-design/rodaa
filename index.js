const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// Rota para testar se está online
app.get('/', (req, res) => res.send('API Fritzza rodando! 🍕'));

// Rota para gerar o Pix
app.post('/api/pix', async (req, res) => {
    try {
        // O Render vai ler o seu token que vamos configurar no próximo passo
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);

        const result = await payment.create({ body: req.body });
        res.status(200).json(result);
    } catch (error) {
        console.error("Erro:", error);
        res.status(500).json({ error: "Falha ao gerar Pix" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
