import axios from 'axios';

export default async (req, res) => {
    if (req.method === 'POST') {
        const { totalPrice, orderId } = req.body;

        // API credentials (gunakan sandbox keys)
        const serverKey = process.env.MIDTRANS_SERVER_KEY; // Pastikan Anda menambahkan SERVER_KEY di .env Vercel
        const url = 'https://api.sandbox.midtrans.com/v2/charge'; // Sandbox API URL

        const data = {
            payment_type: 'qris',
            transaction_details: {
                order_id: orderId,
                gross_amount: totalPrice,
            },
            qris: {
                type: 'qris'
            },
        };

        try {
            // Kirim request ke Midtrans API
            const response = await axios.post(url, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${Buffer.from(serverKey + ':').toString('base64')}`
                }
            });

            // Kirim response dari Midtrans ke frontend
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Payment error:', error);
            res.status(500).json({ message: 'Payment failed' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
