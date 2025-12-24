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

  // 3. 使用 Goldsky 的最新公开节点 (原 The Graph 节点已废弃)
  const GRAPH_ENDPOINT = '[https://api.goldsky.com/api/public/project_clus2fndawbcc01w31192938i/subgraphs/polygon-optimistic-oracle-v3/1/gn](https://api.goldsky.com/api/public/project_clus2fndawbcc01w31192938i/subgraphs/polygon-optimistic-oracle-v3/1/gn)';

  try {
    // 4. 转发请求
    const { query } = req.body;
    const response = await fetch(GRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    
    // 检查上游是否返回错误
    if (data.errors) {
       console.error('Graph API Errors:', data.errors);
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Catch Error:', error);
    res.status(500).json({ error: 'Proxy Error', details: error.message });
  }
}
