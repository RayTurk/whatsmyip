// Device Specifications Detection and Display

document.addEventListener('DOMContentLoaded', () => {
    detectAllSpecs();
    setupCopyAllButton();
});

// Main function to detect all specifications
async function detectAllSpecs() {
    detectDisplay();
    await detectHardware();
    await detectGPU();
    detectSystem();
    detectBrowser();
    await detectNetwork();
    detectFeatures();
}

// Display specifications
function detectDisplay() {
    const displayInfo = document.getElementById('display-info');
    
    const width = screen.width;
    const height = screen.height;
    const availWidth = screen.availWidth;
    const availHeight = screen.availHeight;
    const colorDepth = screen.colorDepth;
    const pixelDepth = screen.pixelDepth;
    const pixelRatio = window.devicePixelRatio || 1;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const displayHTML = `
        ${createSpecRow('Screen Resolution', `${width} × ${height} pixels`)}
        ${createSpecRow('Available Resolution', `${availWidth} × ${availHeight} pixels`)}
        ${createSpecRow('Viewport Size', `${viewportWidth} × ${viewportHeight} pixels`)}
        ${createSpecRow('Pixel Ratio', `${pixelRatio}x ${pixelRatio > 1 ? '(Retina/HiDPI)' : ''}`)}
        ${createSpecRow('Color Depth', `${colorDepth}-bit`)}
        ${createSpecRow('Pixel Depth', `${pixelDepth}-bit`)}
        ${createSpecRow('Orientation', screen.orientation?.type || 'N/A')}
    `;
    
    displayInfo.innerHTML = displayHTML;
}

// Hardware specifications
async function detectHardware() {
    const hardwareInfo = document.getElementById('hardware-info');
    
    const cores = navigator.hardwareConcurrency || 'N/A';
    let memory = 'N/A';
    
    // Device Memory API (limited browser support)
    if (navigator.deviceMemory) {
        memory = `~${navigator.deviceMemory} GB`;
    }
    
    // Platform
    const platform = navigator.platform || 'N/A';
    
    // Max touch points (for touch devices)
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    
    const hardwareHTML = `
        ${createSpecRow('CPU Cores', `${cores} logical processor${cores !== 1 ? 's' : ''}`)}
        ${createSpecRow('Memory (RAM)', memory)}
        ${createSpecRow('Platform', platform)}
        ${maxTouchPoints > 0 ? createSpecRow('Touch Points', maxTouchPoints) : ''}
    `;
    
    hardwareInfo.innerHTML = hardwareHTML;
}

// GPU Detection via WebGL
async function detectGPU() {
    const gpuInfo = document.getElementById('gpu-info');
    
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            throw new Error('WebGL not supported');
        }
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        let vendor = 'Unknown';
        let renderer = 'Unknown';
        
        if (debugInfo) {
            vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
        
        // Get WebGL version
        const webglVersion = gl.getParameter(gl.VERSION);
        const shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        
        // Max texture size
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        
        const gpuHTML = `
            ${createSpecRow('Vendor', vendor)}
            ${createSpecRow('Renderer', renderer)}
            ${createSpecRow('WebGL Version', webglVersion)}
            ${createSpecRow('Shading Language', shadingLanguageVersion)}
            ${createSpecRow('Max Texture Size', `${maxTextureSize} × ${maxTextureSize}`)}
        `;
        
        gpuInfo.innerHTML = gpuHTML;
        
    } catch (error) {
        gpuInfo.innerHTML = '<p class="text-gray-500">WebGL not available or blocked</p>';
    }
}

// System Information
function detectSystem() {
    const systemInfo = document.getElementById('system-info');
    const info = parseBrowserInfo();
    
    // Additional system info
    const languages = navigator.languages?.join(', ') || navigator.language || 'N/A';
    const doNotTrack = navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled';
    
    const systemHTML = `
        ${createSpecRow('Operating System', info.os)}
        ${createSpecRow('Architecture', info.architecture)}
        ${createSpecRow('Device Type', info.deviceType)}
        ${createSpecRow('Languages', languages)}
        ${createSpecRow('Do Not Track', doNotTrack)}
    `;
    
    systemInfo.innerHTML = systemHTML;
}

// Browser Information
function detectBrowser() {
    const browserInfo = document.getElementById('browser-info');
    const info = parseBrowserInfo();
    
    // Browser features
    const cookiesEnabled = navigator.cookieEnabled ? 'Yes' : 'No';
    const javaEnabled = typeof navigator.javaEnabled === 'function' ? (navigator.javaEnabled() ? 'Yes' : 'No') : 'N/A';
    const onLine = navigator.onLine ? 'Yes' : 'No';
    
    const browserHTML = `
        ${createSpecRow('Browser', `${info.browserName} ${info.browserVersion}`)}
        ${createSpecRow('User Agent', info.userAgent.substring(0, 60) + '...')}
        ${createSpecRow('Cookies Enabled', cookiesEnabled)}
        ${createSpecRow('Java Enabled', javaEnabled)}
        ${createSpecRow('Online', onLine)}
        ${createSpecRow('PDF Viewer', navigator.pdfViewerEnabled ? 'Built-in' : 'External/None')}
    `;
    
    browserInfo.innerHTML = browserHTML;
}

// Network Information
async function detectNetwork() {
    const networkInfo = document.getElementById('network-info');
    
    let networkHTML = '';
    
    // Online status
    const onlineStatus = navigator.onLine ? '✓ Online' : '✗ Offline';
    networkHTML += createSpecRow('Status', onlineStatus);
    
    // Network Information API (limited support)
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (connection) {
            if (connection.effectiveType) {
                networkHTML += createSpecRow('Connection Type', connection.effectiveType.toUpperCase());
            }
            if (connection.downlink) {
                networkHTML += createSpecRow('Downlink Speed', `${connection.downlink} Mbps`);
            }
            if (connection.rtt) {
                networkHTML += createSpecRow('Round Trip Time', `${connection.rtt} ms`);
            }
            if (connection.saveData !== undefined) {
                networkHTML += createSpecRow('Data Saver', connection.saveData ? 'Enabled' : 'Disabled');
            }
        }
    }
    
    // If no connection API, show basic info
    if (networkHTML === createSpecRow('Status', onlineStatus)) {
        networkHTML += '<p class="text-gray-500 text-sm mt-2">Detailed network info not available</p>';
    }
    
    networkInfo.innerHTML = networkHTML;
}

// Device Features
function detectFeatures() {
    const featuresInfo = document.getElementById('features-info');
    
    // Check various feature supports
    const features = [];
    
    // Storage
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        features.push('Storage API');
    }
    
    // Geolocation
    if ('geolocation' in navigator) {
        features.push('Geolocation');
    }
    
    // Touch
    if (navigator.maxTouchPoints > 0) {
        features.push(`Touch (${navigator.maxTouchPoints} points)`);
    }
    
    // Vibration
    if ('vibrate' in navigator) {
        features.push('Vibration API');
    }
    
    // Battery
    if ('getBattery' in navigator) {
        features.push('Battery API');
    }
    
    // WebGL
    const canvas = document.createElement('canvas');
    if (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) {
        features.push('WebGL');
    }
    
    // Service Workers
    if ('serviceWorker' in navigator) {
        features.push('Service Workers');
    }
    
    // Web Workers
    if ('Worker' in window) {
        features.push('Web Workers');
    }
    
    // WebRTC
    if ('RTCPeerConnection' in window) {
        features.push('WebRTC');
    }
    
    // WebAssembly
    if ('WebAssembly' in window) {
        features.push('WebAssembly');
    }
    
    // Local Storage
    try {
        if ('localStorage' in window && window.localStorage !== null) {
            features.push('Local Storage');
        }
    } catch (e) {}
    
    // Session Storage
    try {
        if ('sessionStorage' in window && window.sessionStorage !== null) {
            features.push('Session Storage');
        }
    } catch (e) {}
    
    // IndexedDB
    if ('indexedDB' in window) {
        features.push('IndexedDB');
    }
    
    const featuresHTML = `
        <div class="spec-row">
            <span class="spec-label">Supported Features</span>
            <span class="spec-value">${features.length} detected</span>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
            ${features.map(feature => 
                `<span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">${feature}</span>`
            ).join('')}
        </div>
    `;
    
    featuresInfo.innerHTML = featuresHTML;
}

// Copy all specs to clipboard
function setupCopyAllButton() {
    const copyButton = document.getElementById('copy-all-specs');
    
    copyButton.addEventListener('click', async () => {
        const specs = await collectAllSpecs();
        const success = await copyToClipboard(specs);
        if (success) {
            showCopyFeedback('copy-feedback');
        }
    });
}

// Collect all specs as formatted text
async function collectAllSpecs() {
    const info = parseBrowserInfo();
    
    let specs = '=== DEVICE SPECIFICATIONS ===\n\n';
    
    specs += '--- DISPLAY ---\n';
    specs += `Screen Resolution: ${screen.width} × ${screen.height}\n`;
    specs += `Pixel Ratio: ${window.devicePixelRatio || 1}x\n`;
    specs += `Color Depth: ${screen.colorDepth}-bit\n\n`;
    
    specs += '--- HARDWARE ---\n';
    specs += `CPU Cores: ${navigator.hardwareConcurrency || 'N/A'}\n`;
    specs += `Memory: ${navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : 'N/A'}\n\n`;
    
    specs += '--- SYSTEM ---\n';
    specs += `OS: ${info.os}\n`;
    specs += `Architecture: ${info.architecture}\n`;
    specs += `Device Type: ${info.deviceType}\n\n`;
    
    specs += '--- BROWSER ---\n';
    specs += `Browser: ${info.browserName} ${info.browserVersion}\n`;
    specs += `User Agent: ${info.userAgent}\n\n`;
    
    return specs;
}
