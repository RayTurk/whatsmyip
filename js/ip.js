// IP Address Detection and Display

document.addEventListener('DOMContentLoaded', async () => {
    await fetchIPInfo();
    displayBrowserInfo();
    setupCopyButton();
});

// Fetch IP information from ipapi.co (free tier: 1000 requests/day)
async function fetchIPInfo() {
    const ipDisplay = document.getElementById('ip-display');
    const locationInfo = document.getElementById('location-info');
    const ispInfo = document.getElementById('isp-info');
    
    try {
        // Using ipapi.co - free tier with no API key required
        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
            throw new Error('Failed to fetch IP info');
        }
        
        const data = await response.json();
        
        // Display IP Address
        ipDisplay.innerHTML = `<span class="ip-address">${data.ip}</span>`;
        document.getElementById('copy-ip').classList.remove('hidden');
        
        // Display Location
        const locationHTML = `
            ${createSpecRow('Country', `${data.country_name} (${data.country_code})`)}
            ${createSpecRow('Region', data.region || 'N/A')}
            ${createSpecRow('City', data.city || 'N/A')}
            ${createSpecRow('Postal Code', data.postal || 'N/A')}
            ${data.latitude && data.longitude ? createSpecRow('Coordinates', `${data.latitude}, ${data.longitude}`) : ''}
            ${createSpecRow('Timezone', data.timezone || 'N/A')}
        `;
        locationInfo.innerHTML = locationHTML;
        
        // Display ISP Info
        const ispHTML = `
            ${createSpecRow('ISP', data.org || 'N/A')}
            ${createSpecRow('ASN', data.asn || 'N/A')}
            ${createSpecRow('Network', data.network || 'N/A')}
        `;
        ispInfo.innerHTML = ispHTML;
        
    } catch (error) {
        console.error('Error fetching IP info:', error);
        
        // Fallback: Show basic info without API
        ipDisplay.innerHTML = '<span class="text-red-600">Unable to fetch IP</span>';
        locationInfo.innerHTML = '<p class="text-gray-500">Location information unavailable</p>';
        ispInfo.innerHTML = '<p class="text-gray-500">ISP information unavailable</p>';
    }
}

// Display browser and system information
function displayBrowserInfo() {
    const browserInfo = document.getElementById('browser-info');
    const systemInfo = document.getElementById('system-info');
    
    const info = parseBrowserInfo();
    
    // Browser Info
    const browserHTML = `
        ${createSpecRow('Browser', `${info.browserName} ${info.browserVersion}`)}
        ${createSpecRow('User Agent', info.userAgent.substring(0, 50) + '...')}
        ${createSpecRow('Language', navigator.language || 'N/A')}
        ${createSpecRow('Cookies Enabled', navigator.cookieEnabled ? 'Yes' : 'No')}
    `;
    browserInfo.innerHTML = browserHTML;
    
    // System Info
    const systemHTML = `
        ${createSpecRow('Operating System', info.os)}
        ${createSpecRow('Architecture', info.architecture)}
        ${createSpecRow('Device Type', info.deviceType)}
        ${createSpecRow('Screen Resolution', `${screen.width} × ${screen.height}`)}
    `;
    systemInfo.innerHTML = systemHTML;
}

// Setup copy IP button
function setupCopyButton() {
    const copyButton = document.getElementById('copy-ip');
    
    copyButton.addEventListener('click', async () => {
        const ipAddress = document.querySelector('.ip-address')?.textContent;
        if (ipAddress) {
            const success = await copyToClipboard(ipAddress);
            if (success) {
                showCopyFeedback('copy-feedback');
            }
        }
    });
}
