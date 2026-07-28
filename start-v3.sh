#!/bin/bash
# Local development server for v3.0 3D Portfolio site

PORT=${1:-3000}

# Update live GitHub stargazers data
npm run update-stars

# Launch Vite dev server with forced dependency cache clearing and full host binding
npx vite --force --host 0.0.0.0 --port ${PORT}
