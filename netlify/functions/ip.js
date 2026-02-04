let cachedIPInfo = null;
let cacheTime = 0;

export async function handler(event) {
  const clientIP = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || event.headers['x-forwarded-for']?.split(',')[0]?.trim();

  const now = Date.now();
  if (cachedIPInfo && cachedIPInfo.ip === clientIP && (now - cacheTime < 5 * 60 * 1000)) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cachedIPInfo),
    };
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    const raw = await response.json();

    if (raw.status !== 'success') {
      throw new Error(raw.message || 'IP lookup failed');
    }

    // Map to the field names the frontend expects
    const data = {
      ip: raw.query,
      country_name: raw.country,
      country_code: raw.countryCode,
      region: raw.regionName,
      city: raw.city,
      postal: raw.zip,
      latitude: raw.lat,
      longitude: raw.lon,
      timezone: raw.timezone,
      org: raw.isp,
      asn: raw.as,
      network: raw.org,
    };

    cachedIPInfo = data;
    cacheTime = now;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch IP info' }),
    };
  }
}
