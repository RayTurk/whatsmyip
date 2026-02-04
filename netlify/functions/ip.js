let cachedIPInfo = null;
let cacheTime = 0;

export async function handler(event) {
  const clientIP = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || event.headers['x-forwarded-for']?.split(',')[0]?.trim();

  const now = Date.now();
  if (cachedIPInfo && cachedIPInfo.ip === clientIP && (now - cacheTime < 5 * 60 * 1000)) {
    return {
      statusCode: 200,
      body: JSON.stringify(cachedIPInfo),
    };
  }

  try {
    const response = await fetch(`https://ipapi.co/${clientIP}/json/`);
    const data = await response.json();
    cachedIPInfo = data;
    cacheTime = now;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch IP info' }),
    };
  }
}
