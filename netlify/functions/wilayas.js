const { createClient } = require('@supabase/supabase-js');
const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret', 'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS' };

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase.from('wilaya_pricing').select('*');
    if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  }

  if (event.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  if (event.httpMethod === 'PUT') {
    const payload = JSON.parse(event.body || '{}'); // tableau [{wilaya_code, price}, ...] ou objet unique
    if (!Array.isArray(payload)) {
      const { wilaya_code, price } = payload;
      if (!wilaya_code || price === undefined) return { statusCode: 400, body: 'Missing fields' };
      const { error } = await supabase.from('wilaya_pricing').upsert({ wilaya_code, price });
      if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
    } else {
      for (const item of payload) {
        const { wilaya_code, price } = item;
        if (!wilaya_code || price === undefined) continue;
        const { error } = await supabase.from('wilaya_pricing').upsert({ wilaya_code, price });
        if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
      }
    }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};