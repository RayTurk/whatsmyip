 #!/usr/bin/env python3
"""
Add Google Tag Manager to all HTML files in the project.
This script adds GTM snippet to <head> and <body> of all .html files.
"""

import os
import re

# GTM snippets
GTM_HEAD = '''    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-K6JXCT6S');</script>
    <!-- End Google Tag Manager -->
    '''

GTM_BODY = '''    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-K6JXCT6S"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    '''

def add_gtm_to_file(filepath):
    """Add GTM snippets to an HTML file if not already present."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if GTM already exists
    if 'GTM-K6JXCT6S' in content:
        print(f"✓ {filepath} - GTM already present")
        return False

    # Add GTM to <head> (right after <head> tag)
    head_pattern = r'(<head>)'
    if re.search(head_pattern, content):
        content = re.sub(head_pattern, r'\1\n' + GTM_HEAD, content, count=1)
    else:
        print(f"✗ {filepath} - Could not find <head> tag")
        return False

    # Add GTM noscript to <body> (right after <body> tag)
    body_pattern = r'(<body[^>]*>)'
    if re.search(body_pattern, content):
        content = re.sub(body_pattern, r'\1\n' + GTM_BODY, content, count=1)
    else:
        print(f"✗ {filepath} - Could not find <body> tag")
        return False

    # Write updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ {filepath} - GTM added successfully")
    return True

def main():
    """Find all HTML files and add GTM to them."""
    html_files = []

    # Find all .html files in current directory
    for filename in os.listdir('.'):
        if filename.endswith('.html') and filename != 'gtm-test.html':
            html_files.append(filename)

    if not html_files:
        print("No HTML files found in current directory.")
        return

    print(f"Found {len(html_files)} HTML files")
    print("-" * 50)

    updated = 0
    for filepath in sorted(html_files):
        if add_gtm_to_file(filepath):
            updated += 1

    print("-" * 50)
    print(f"Updated {updated} file(s)")

if __name__ == '__main__':
    main()