#!/bin/bash
# Local development preview script for v3.0 3D site

PORT=${1:-3000}

if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

python3 scripts/serve_v3.py ${PORT}
