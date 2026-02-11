// scripts/indexnow.js

const https = require("https");

const HOST = "www.deviceinfo.io";
const KEY = process.env.INDEXNOW_KEY;
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

function fetchSitemap(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function extractUrls(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

function submitToIndexNow(urlList) {
  const postData = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  });

  const options = {
    hostname: "api.indexnow.org",
    path: "/IndexNow",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    console.log(`IndexNow Status: ${res.statusCode}`);
  });

  req.on("error", (e) => {
    console.error(`Error: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

(async () => {
  try {
    console.log("Fetching sitemap...");
    const xml = await fetchSitemap(SITEMAP_URL);

    const urls = extractUrls(xml);
    console.log(`Found ${urls.length} URLs`);

    submitToIndexNow(urls);
  } catch (err) {
    console.error("Failed:", err);
  }
})();
