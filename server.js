const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  const { text, rewrite } = req.body;

  const prompt = rewrite
    ? `Rewrite the following text with better grammar, clarity, and flow:\n\n${text}`
    : `Review the following text for grammar, clarity, spell check and style. Provide a list of suggestions:\n\n${text}`;

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`
      },
      body: JSON.stringify({
        model: "command",
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.6
      })
    });

    const data = await response.json();
    res.json({ result: data.generations?.[0]?.text || "No response" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "API call failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
