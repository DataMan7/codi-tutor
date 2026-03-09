// server.js - BACKEND FILE (in ~/Desktop/remoteApp/)
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit'); // Added for rate limiting
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rate limiter for the chat endpoint - prevents API abuse
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { response: "Too many requests, please try again later." }, // Generic message
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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

// Apply rate limiter to the chat endpoint
app.post('/api/chat', chatLimiter, async (req, res) => {
    try {
        const { messages } = req.body;

        // --- Input validation ---
        // Check if messages exists and is an array
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ response: "Invalid request format." });
        }

        // Sanitize each message:
        // - Ensure sender is either 'user' or 'assistant' (default to 'assistant' if unknown)
        // - Limit text length to 2000 characters to prevent abuse
        // - Filter out empty messages
        const sanitizedMessages = messages
            .map(m => ({
                sender: m.sender === 'user' ? 'user' : 'assistant',
                text: typeof m.text === 'string' ? m.text.substring(0, 2000) : ''
            }))
            .filter(m => m.text.length > 0);

        // If all messages were invalid/empty, return error
        if (sanitizedMessages.length === 0) {
            return res.status(400).json({ response: "No valid messages provided." });
        }

        // Build conversation history from sanitized messages
        const conversationHistory = sanitizedMessages.map(m => ({
            role: m.sender,
            content: m.text
        }));

        // Call NVIDIA API
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

        // Handle API errors
        if (!response.ok) {
            // Log detailed error server-side for debugging
            const errorText = await response.text();
            console.error(`NVIDIA API error (${response.status}): ${errorText}`);
            throw new Error('API request failed');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Send successful response
        res.json({ response: aiResponse });
    } catch (error) {
        // Log detailed error server-side
        console.error('Error in /api/chat:', error);
        
        // Send only generic message to client - no error details exposed
        res.status(500).json({
            response: "Oops! My circuits got tangled 🤖 Try again in a moment!"
        });
    }
});

// Serve React app static files
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route: send index.html for any unknown paths (supports client-side routing)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server with PicoClaw-style Kimi running on port ${PORT}`));