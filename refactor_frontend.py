#!/usr/bin/env python3
"""
Production Refactoring Script for MyTube Frontend
Automatically refactors all frontend files to use centralized API
"""

import os
import re

# Base directory
FRONTEND_DIR = "/Users/commerciax-fs-1/my_tube/frontend/src"

# Files to refactor (excluding already done ones)
FILES_TO_REFACTOR = [
    "Pages/History.js",
    "Pages/Login.js",
    "Pages/Signup.js",
    "Pages/RevenueDashboard.js",
    "Pages/AdminMonetizationPanel.jsx",
    "Pages/AdminUploadAd.js",
    "Pages/LikedVideos.js",
    "Pages/LivePage.js",
    "Pages/Profile.js",
    "Pages/Shorts.jsx",
    "Pages/Upload.js",
    "Pages/UserUpload.js",
    "Pages/Watch.js",
    "Pages/Home.js",
    "components/Sidebar.js",
    "components/Notifications.jsx"
]

def refactor_file(filepath):
    """Refactor a single file"""
    full_path = os.path.join(FRONTEND_DIR, filepath)
    
    if not os.path.exists(full_path):
        print(f"❌ File not found: {filepath}")
        return False
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Replace axios import with api import
    if 'import axios from "axios"' in content or "import axios from 'axios'" in content:
        content = re.sub(
            r'import axios from ["\']axios["\'];?',
            'import api from "../config/api";',
            content
        )
        print(f"  ✓ Replaced axios import in {filepath}")
    
    # 2. Replace axios.get() with api.get()
    content = re.sub(r'\baxios\.get\(', 'api.get(', content)
    
    # 3. Replace axios.post() with api.post()
    content = re.sub(r'\baxios\.post\(', 'api.post(', content)
    
    # 4. Replace axios.put() with api.put()
    content = re.sub(r'\baxios\.put\(', 'api.put(', content)
    
    # 5. Replace axios.delete() with api.delete()
    content = re.sub(r'\baxios\.delete\(', 'api.delete(', content)
    
    # 6. Replace axios.patch() with api.patch()
    content = re.sub(r'\baxios\.patch\(', 'api.patch(', content)
    
    # 7. Remove hardcoded localhost URLs in API calls
    content = re.sub(
        r'"http://localhost:5000(/api/[^"]+)"',
        r'"\1"',
        content
    )
    content = re.sub(
        r"'http://localhost:5000(/api/[^']+)'",
        r"'\1'",
        content
    )
    content = re.sub(
        r'`http://localhost:5000(/api/[^`]+)`',
        r'`\1`',
        content
    )
    
    # 8. Replace localhost URLs in template literals for static files
    content = re.sub(
        r'`http://localhost:5000/uploads/\$\{([^}]+)\}`',
        r'`${process.env.REACT_APP_API_URL}/uploads/${\1}`',
        content
    )
    
    # 9. Replace localhost URLs in regular strings for static files
    content = re.sub(
        r'"http://localhost:5000/uploads/',
        '"${process.env.REACT_APP_API_URL}/uploads/',
        content
    )
    content = re.sub(
        r"'http://localhost:5000/uploads/",
        "'${process.env.REACT_APP_API_URL}/uploads/",
        content
    )
    
    # 10. Replace localhost URLs for captions
    content = re.sub(
        r'http://localhost:5000/captions/',
        '${process.env.REACT_APP_API_URL}/captions/',
        content
    )
    
    # 11. Remove manual token headers (but keep onUploadProgress and other config)
    # This is tricky - we need to remove Authorization headers but keep other headers
    # Pattern: headers: { Authorization: `Bearer ${token}` }
    content = re.sub(
        r',\s*headers:\s*\{\s*Authorization:\s*`Bearer\s*\$\{[^}]+\}`\s*\}',
        '',
        content
    )
    content = re.sub(
        r'headers:\s*\{\s*Authorization:\s*`Bearer\s*\$\{[^}]+\}`\s*\},?',
        '',
        content
    )
    
    # 12. Remove localStorage.getItem("token") lines that are no longer needed
    # Only remove if they're standalone (not used elsewhere)
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        # Skip lines that only get token and do nothing else
        if re.match(r'^\s*const\s+token\s*=\s*localStorage\.getItem\(["\']token["\']\);?\s*$', line):
            continue
        new_lines.append(line)
    content = '\n'.join(new_lines)
    
    # Only write if content changed
    if content != original_content:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Refactored: {filepath}")
        return True
    else:
        print(f"⏭️  No changes needed: {filepath}")
        return False

def main():
    print("🚀 Starting Production Refactoring...")
    print(f"📁 Base directory: {FRONTEND_DIR}\n")
    
    refactored_count = 0
    skipped_count = 0
    
    for filepath in FILES_TO_REFACTOR:
        if refactor_file(filepath):
            refactored_count += 1
        else:
            skipped_count += 1
    
    print(f"\n✨ Refactoring Complete!")
    print(f"   Refactored: {refactored_count} files")
    print(f"   Skipped: {skipped_count} files")

if __name__ == "__main__":
    main()
