const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message, birthDetails } = req.body;
    const finalPrompt = `User details: Name: ${birthDetails.name}, DOB: ${birthDetails.dob}, Time: ${birthDetails.time}, Pincode: ${birthDetails.pincode}, Gender: ${birthDetails.gender}. Question: ${message}`;

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [{ parts: [{ text: finalPrompt }] }]
            },
            { params: { key: process.env.GEMINI_API_KEY } }
        );

        res.json({ reply: response.data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

app.get('/', (req, res) => {
    res.send('WebAstroAI Backend Running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));