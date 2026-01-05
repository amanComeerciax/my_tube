#!/bin/bash

# MyTube Code Cleanup Script
# Removes all commented code blocks from frontend files

echo "🧹 Starting MyTube Code Cleanup..."

FRONTEND_DIR="/Users/commerciax-fs-1/my_tube/frontend/src/Pages"
BACKEND_DIR="/Users/commerciax-fs-1/my_tube/backend"

# Backup directory
BACKUP_DIR="/Users/commerciax-fs-1/my_tube/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup at: $BACKUP_DIR"

# Backup all files before cleanup
cp -r "$FRONTEND_DIR" "$BACKUP_DIR/Pages"
cp -r "$BACKEND_DIR" "$BACKUP_DIR/backend"

echo "✅ Backup created successfully!"

# Function to remove commented blocks
remove_commented_blocks() {
    local file="$1"
    local temp_file="${file}.tmp"
    
    # Remove multi-line comments (// at start of line)
    awk '
    BEGIN { in_comment = 0 }
    /^[[:space:]]*\/\// { 
        if (!in_comment) in_comment = 1
        next 
    }
    /^[[:space:]]*[^\/]/ { 
        in_comment = 0
        print
    }
    !in_comment { print }
    ' "$file" > "$temp_file"
    
    mv "$temp_file" "$file"
}

# Count lines before
echo "📊 Lines before cleanup:"
wc -l "$FRONTEND_DIR"/*.js "$FRONTEND_DIR"/*.jsx 2>/dev/null | tail -1

# Clean all JS/JSX files
echo "🧹 Cleaning frontend files..."
for file in "$FRONTEND_DIR"/*.js "$FRONTEND_DIR"/*.jsx; do
    if [ -f "$file" ]; then
        echo "  Cleaning: $(basename $file)"
        remove_commented_blocks "$file"
    fi
done

# Clean backend server.js
echo "🧹 Cleaning backend files..."
remove_commented_blocks "$BACKEND_DIR/server.js"

# Count lines after
echo "📊 Lines after cleanup:"
wc -l "$FRONTEND_DIR"/*.js "$FRONTEND_DIR"/*.jsx 2>/dev/null | tail -1

echo "✅ Cleanup complete!"
echo "📦 Backup location: $BACKUP_DIR"
echo "⚠️  Please test the application before deleting backup!"
