export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientSecret) {
    res.status(500).json({ error: 'Missing GITHUB_CLIENT_SECRET environment variable in Vercel.' });
    return;
  }
  const { client_id, code, redirect_uri, code_verifier } = req.body || {};
  if (!client_id || !code || !redirect_uri || !code_verifier) {
    res.status(400).json({ error: 'Missing OAuth parameters.' });
    return;
  }
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ client_id, client_secret: clientSecret, code, redirect_uri, code_verifier })
    });
    const data = await tokenRes.json();
    if (!tokenRes.ok || data.error) {
      res.status(400).json(data);
      return;
    }
    res.status(200).json({ access_token: data.access_token, scope: data.scope, token_type: data.token_type });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Token exchange failed.' });
  }
}
