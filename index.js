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
}); // <-- O erro estava aqui! Faltava esse fechamento.

// Rota de "Despertador" para o UptimeRobot não deixar o Render dormir
app.get('/api/ping', (req, res) => {
    // Pega a data e hora atual no fuso de Brasília para facilitar o log
    const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    
    // Imprime no painel do Render só para você ter certeza que está funcionando
    console.log(`[ALERTA] UptimeRobot pingou o servidor às ${dataAtual}`);
    
    // Devolve um status 200 (OK) para o UptimeRobot não registrar queda
    res.status(200).json({ 
        status: 'online', 
        message: 'A API da Fritzza está acordada e pronta para vender!',
        time: dataAtual
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
