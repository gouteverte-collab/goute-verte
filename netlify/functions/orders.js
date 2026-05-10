const { createClient } = require('@supabase/supabase-js');

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Création de commande (public)
  if (event.httpMethod === 'POST') {
    const order = JSON.parse(event.body || '{}');
    if (!order.id || !order.client || !order.phone || !order.wilaya || !order.address || !order.products || !order.total || !order.delivery) {
      return { statusCode: 400, body: 'Missing required fields' };
    }
    const { error } = await supabase.from('orders').insert(order);
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
    return { statusCode: 201, headers, body: JSON.stringify({ success: true }) };
  }

  // Toutes les autres méthodes nécessitent le secret admin
  if (event.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  if (event.httpMethod === 'GET') {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  }

  if (event.httpMethod === 'PUT') {
    const { id, ...updates } = JSON.parse(event.body || '{}');
    if (!id) return { statusCode: 400, body: 'Missing id' };
    const { error } = await supabase.from('orders').update(updates).eq('id', id);
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (event.httpMethod === 'DELETE') {
    const { id } = JSON.parse(event.body || '{}');
    if (!id) return { statusCode: 400, body: 'Missing id' };
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) return { statusCode: 400, body: JSON.stringify({ error }) };
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};