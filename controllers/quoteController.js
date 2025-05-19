const axios = require("axios");

exports.getQuote = async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/random');
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch quote:", error); // log the full error
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
};
