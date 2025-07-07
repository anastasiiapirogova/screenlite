#!/bin/bash

# Script to deploy database with fallback to reset
# First tries db:deploy, if it fails, runs migrate reset
# 
# NOTE: Since this is used in the dev Dockerfile, it's easier to migrate fresh
# than to fix existing migration errors. This approach ensures a clean development
# environment and avoids complex migration conflict resolution.

set -e

echo "Attempting to deploy database..."

# Try db:deploy first
if npm run db:deploy; then
    echo "Database deployment successful!"
    exit 0
else
    echo "Database deployment failed. Attempting migrate reset..."
    
    # Run migrate reset as fallback
    if npm run db:reset; then
        echo "Database reset successful!"
        exit 0
    else
        echo "Both db:deploy and db:reset failed!"
        exit 1
    fi
fi 