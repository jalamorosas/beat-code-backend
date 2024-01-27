const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci/completions';

app.post('/generate-text', async (req, res) => {
    const prompt = req.body.prompt;
    const apiKey = 'YOUR_OPENAI_API_KEY';

    try {
        const response = await axios.post(OPENAI_API_URL, {
            prompt: prompt,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error communicating with OpenAI' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
