export default async function handler(req, res) {
  // 1. 设置允许跨域访问 (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 2. 如果是浏览器预检请求，直接通过
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/uma-protocol/optimistic-oracle-v3-polygon';

  try {
    // 3. 转发请求到 The Graph
    const { query } = req.body;
    const response = await fetch(GRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy Error' });
  }
}
