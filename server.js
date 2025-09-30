// ✅ Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Handle dream submission
app.post('/submit-dream', (req, res) => {
  const { dream } = req.body;
  if (!dream) return res.status(400).json({ error: 'No dream received' });

  const filePath = path.join(__dirname, 'dreams.json');
  let dreams = [];

  if (fs.existsSync(filePath)) {
    dreams = JSON.parse(fs.readFileSync(filePath));
  }

  dreams.push({ dream, timestamp: new Date().toISOString() });

  fs.writeFileSync(filePath, JSON.stringify(dreams, null, 2));
  res.json({ message: 'Dream received' });
});

// Handle story generation
app.post('/generate-story', async (req, res) => {
  const { dream } = req.body;
  if (!dream) return res.status(400).json({ error: 'No dream provided' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Missing API key' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://siribeesu.github.io/dreams-to-stories-frontend/', // required
        'X-Title': 'dreams-to-stories'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a magical story generator that turns dreams into short, vivid, adventure stories for children and teens.'
          },
          {
            role: 'user',
            content: dream
          }
        ]
      })
    });

    const data = await response.json();

    if (data?.choices?.[0]?.message?.content) {
      res.json({ story: data.choices[0].message.content });
    } else {
      console.error('Unexpected API response:', data);
      res.status(500).json({ error: 'Error generating story' });
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Story generation failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
