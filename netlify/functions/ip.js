let cachedIPInfo = null;
let cacheTime = 0;

export async function handler() {
  const now = Date.now();
  if (cachedIPInfo && (now - cacheTime < 5 * 60 * 1000)) {
    return {
      statusCode: 200,
      body: JSON.stringify(cachedIPInfo),
    };
  }

  try {
    const response = await fetch('https://ipapi.co/json/');
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
