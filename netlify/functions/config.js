const { createClient } = require('@supabase/supabase-js');
const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret', 'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS' };

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase.from('config').select('*').single();
    if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  }

  if (event.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  if (event.httpMethod === 'PUT') {
    const payload = JSON.parse(event.body || '{}');
    const { error } = await supabase.from('config').update(payload).eq('id', 1);
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};