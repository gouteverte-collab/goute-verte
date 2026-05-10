const { createClient } = require('@supabase/supabase-js');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Lecture publique
  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  }

  // Toutes les autres méthodes nécessitent le secret admin
  if (event.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  const payload = JSON.parse(event.body || '{}');

  if (event.httpMethod === 'POST') {
    if (!payload.name || !payload.price) return { statusCode: 400, body: 'Missing name or price' };
    const { data, error } = await supabase.from('products').insert(payload).select();
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
    return { statusCode: 201, headers, body: JSON.stringify(data[0]) };
  }

  if (event.httpMethod === 'PUT') {
    const { id, ...updates } = payload;
    if (!id) return { statusCode: 400, body: 'Missing id' };
    const { error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (event.httpMethod === 'DELETE') {
    const { id } = payload;
    if (!id) return { statusCode: 400, body: 'Missing id' };
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};