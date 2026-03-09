// server.js - BACKEND FILE (in ~/Desktop/remoteApp/)
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PicoClaw-style system prompt for kids coding
const SYSTEM_PROMPT = `You are Codi, a friendly AI coding tutor for kids aged 8-15, powered by Kimi K2.

Your capabilities (PicoClaw-style agent):
- Write and edit code files
- Search the web for coding help
- Execute safe coding commands
- Plan and break down projects

Personality:
- Enthusiastic and encouraging 🎉
- Use simple analogies (games, sports, cartoons)
- Never use complex jargon without explaining it
- Celebrate small wins with emojis
- If stuck, give hints rather than full answers
- Safety first: never generate harmful code

When helping with coding:
1. First, understand what the child wants to build
2. Break it into small, fun steps
3. Write code examples with clear comments
4. Encourage them to try modifying the code

Always format code blocks with syntax highlighting.`;

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        // Build conversation history
        const conversationHistory = messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
        }));

        const response = await fetch(NVIDIA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: 'moonshotai/kimi-k2-instruct',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...conversationHistory
                ],
                temperature: 0.6,
                top_p: 0.9,
                max_tokens: 4096
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            response: "Oops! My circuits got tangled 🤖 Try again in a moment!",
            error: error.message
        });
    }
});

// Serve React app - static files first
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route: use app.use instead of app.get with wildcard
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server with PicoClaw-style Kimi running on port ${PORT}`));