exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { code } = JSON.parse(event.body || '{}');

  if (code === process.env.ADMIN_SECRET) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' },
      body: JSON.stringify({ valid: true })
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify({ valid: false })
  };
};