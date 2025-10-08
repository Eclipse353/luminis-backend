import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.static('public')); // serve your HTML/CSS/JS

// proxy endpoint
app.get('/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    // decode the URL if it was encoded
    const targetUrl = decodeURIComponent(url);

    // fetch the actual content
    const response = await fetch(targetUrl);
    let body = await response.text();

    // rewrite relative URLs so the iframe doesn't reload your site
    body = body.replace(/(href|src)=["']([^'"]+)["']/g, (match, attr, val) => {
      if(val.startsWith('http') || val.startsWith('//')) return match; // absolute URLs fine
      return `${attr}="/proxy?url=${encodeURIComponent(new URL(val, targetUrl))}"`;
    });

    res.send(body);
  } catch(e) {
    res.status(500).send('Failed to fetch URL');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
