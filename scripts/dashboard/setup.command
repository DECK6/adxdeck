#!/bin/zsh
set -eu
script_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
python3 "$script_dir/setup-key.py"
