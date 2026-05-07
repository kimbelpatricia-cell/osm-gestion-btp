const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('.'));

const API_KEY = process.env.NOTION_API_KEY;
const NOTION_VERSION = '2022-06-28';

async function notionFetch(path, method, body) {
  const fetch = (await import('node-fetch')).default;
  const url = 'https://api.notion.com/v1/' + path;
  const res = await fetch(url, {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + API_KEY,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

app.post('/notion/databases/:id/query', async (req, res) => {
  try {
    const data = await notionFetch('databases/' + req.params.id + '/query', 'POST', req.body);
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/notion/pages/:id', async (req, res) => {
  try {
    const data = await notionFetch('pages/' + req.params.id, 'GET');
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/notion/databases/:id', async (req, res) => {
  try {
    const data = await notionFetch('databases/' + req.params.id, 'GET');
    res.json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => {
  console.log('');
  console.log('✅ Serveur OSM démarré sur http://localhost:3000');
  console.log('📂 Ouvre : http://localhost:3000/gestion_btp_osm_notion.html');
  console.log('');
});
