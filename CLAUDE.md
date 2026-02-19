# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DeviceInfo.io (whatsmyip) is a static utility website that displays IP addresses and device specifications. Built for passive ad revenue with vanilla HTML/CSS/JavaScript (no frameworks).

**Live site**: deviceinfo.io
**Hosting**: Netlify with serverless functions
**Monetization**: Google AdSense

## Development

**No build process required** - this is a static site with pre-compiled Tailwind CSS.

To develop locally, open any HTML file directly in a browser. The only exception is the IP lookup feature, which requires the Netlify serverless function (`netlify/functions/ip.js`).

For local development with serverless functions:
```bash
npx netlify-cli dev
```

**Deployment**: Push to `main` branch triggers auto-deploy to Netlify.

## Architecture

### Frontend Structure
- **HTML pages**: Root-level `.html` files are individual pages (index, specs, browser, gpu, screen-size, etc.)
- **`/blog/`**: Blog posts for SEO
- **`/js/`**: JavaScript modules
  - `main.js` - Shared utilities (parseBrowserInfo, formatBytes, copyToClipboard, createSpecRow)
  - `ip.js` - IP detection, calls Netlify function at `/.netlify/functions/ip`
  - `specs.js` - Hardware/GPU detection using WebGL and Navigator APIs
- **`/css/`**: Pre-built Tailwind CSS (not CDN)

### Backend
- **`/netlify/functions/ip.js`**: Serverless function that:
  - Gets client IP from Netlify headers
  - Calls ip-api.com for geolocation data
  - Maps API response to frontend field names
  - Caches results for 5 minutes

### Key Web APIs Used
- WebGL `WEBGL_debug_renderer_info` extension for GPU detection
- Navigator API for hardware concurrency, device memory, touch points
- Screen API for resolution, color depth, orientation
- Network Information API for connection type

## Configuration

**`netlify.toml`** defines:
- Redirect: `/device-info.html` → `/specs.html` (301)
- Caching strategy: HTML (revalidate), CSS/JS/images (1 year immutable)
- Security headers (X-Frame-Options, CSP, Permissions-Policy)

## External Services
- **ip-api.com**: IP geolocation (free tier: 45 req/minute)
- **Google Tag Manager**: GTM-K6JXCT6S
- **Google AdSense**: ca-pub-9529757615457255
- **IndexNow**: Search engine indexing (`scripts/indexnow.js`)
