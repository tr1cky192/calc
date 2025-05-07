// /pages/api/fetchCategories.js
export default async function handler(req, res) {
    try {
      const response = await fetch('https://asmos.hi-it.com.ua/wp-json/wc/v3/products', {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64')}`,
        },
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  }
  