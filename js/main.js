// Shared utility functions

// Parse user agent string to extract browser info
function parseBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "Unknown";
    let os = "Unknown";
    let deviceType = "Desktop";

    // Detect browser
    if (ua.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (ua.indexOf("Edg") > -1) {
        browserName = "Microsoft Edge";
        browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1) {
        browserName = "Chrome";
        browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
        browserName = "Safari";
        browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
    } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        browserName = "Opera";
        browserVersion = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || "Unknown";
    }

    // Detect OS
    if (ua.indexOf("Windows NT 10.0") > -1) os = "Windows 10/11";
    else if (ua.indexOf("Windows NT") > -1) os = "Windows";
    else if (ua.indexOf("Mac OS X") > -1) os = "macOS";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("iOS") > -1 || ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";

    // Detect device type
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
        if (/iPad|Tablet/i.test(ua)) {
            deviceType = "Tablet";
        } else {
            deviceType = "Mobile";
        }
    }

    // Detect architecture
    const is64Bit = ua.indexOf("Win64") > -1 || ua.indexOf("x64") > -1 || ua.indexOf("x86_64") > -1 || ua.indexOf("amd64") > -1;
    const architecture = is64Bit ? "64-bit" : "32-bit";

    return {
        browserName,
        browserVersion,
        os,
        deviceType,
        architecture,
        userAgent: ua
    };
}

// Format bytes to human readable
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (err) {
            document.body.removeChild(textarea);
            return false;
        }
    }
}

// Show copy feedback
function showCopyFeedback(feedbackElementId) {
    const feedback = document.getElementById(feedbackElementId);
    if (feedback) {
        feedback.classList.remove('hidden');
        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 2000);
    }
}

// Create spec row HTML
function createSpecRow(label, value) {
    return `
        <div class="spec-row">
            <span class="spec-label">${label}</span>
            <span class="spec-value">${value}</span>
        </div>
    `;
}
