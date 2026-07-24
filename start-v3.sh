#!/bin/bash
# Local development preview script for v3.0 3D site

PORT=${1:-3000}

# Activate virtual environment if it exists
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
elif [ -f ".venv/Scripts/activate" ]; then
    source .venv/Scripts/activate
fi

# Use python3 if available, otherwise fallback to python
if command -v python3 >/dev/null 2>&1; then
    python3 -u scripts/serve_v3.py ${PORT}
else
    python -u scripts/serve_v3.py ${PORT}
fi
