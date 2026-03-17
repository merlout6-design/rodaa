const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// Rota base para testar
app.get('/', (req, res) => res.send('API Fritzza rodando! 🍕'));

// 1. Rota para GERAR o Pix (POST)
app.post('/api/pix', async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);
        
        const result = await payment.create({ body: req.body });
        res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao gerar:", error);
        res.status(500).json({ error: "Falha ao gerar Pix" });
    }
});

// 2. Rota para CONSULTAR o status do Pix (GET) -> Isso resolve o erro 404!
app.get('/api/pix/:id', async (req, res) => {
    try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
        const payment = new Payment(client);
        
        const result = await payment.get({ id: req.params.id });
        res.status(200).json(result);
    } catch (error) {
        console.error("Erro ao consultar:", error);
        res.status(500).json({ error: "Falha ao consultar pagamento" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
