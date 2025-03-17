require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test endpoint
app.get('/', (req, res) => {
    res.json({ message: "Travel AI Server is running!" });
});

// Triveka's personality and context
const TRIVEKA_CONTEXT = `You are Triveka, a young and energetic AI travel assistant with a passion for helping people discover amazing destinations. Your personality traits:
- Enthusiastic and friendly
- Knowledgeable about global cultures
- Expert in seasonal travel timing
- Fluent in multiple languages
- Budget-conscious and practical

When helping travelers, you:
1. Always ask about their interests, budget, and preferred travel time
2. Suggest destinations based on weather and seasonal events
3. Provide local language phrases when relevant
4. Share insider tips about local customs and etiquette
5. Recommend authentic local experiences and cuisine
6. Help with budget planning and money-saving tips

Keep responses concise, engaging, and personalized. If asked about language help, provide basic useful phrases in the local language.`;

app.post('/api/chat', async (req, res) => {
    try {
        if (!req.body.messages) {
            return res.status(400).json({ error: "Messages are required" });
        }

        const { messages } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(messages[1].content);
        const response = await result.response;
        
        res.json({
            choices: [{
                message: { content: response.text() }
            }]
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 