#!/usr/bin/env python3
"""Serialize both radar publishers with an OS lock; no password is needed."""
import fcntl
import os
from pathlib import Path
import subprocess
import sys
import time

directory = Path.home() / '.config/dexa-dash'
directory.mkdir(mode=0o700, parents=True, exist_ok=True)
lockfile = directory / 'publish.lock'
descriptor = os.open(lockfile, os.O_WRONLY | os.O_CREAT | getattr(os, 'O_NOFOLLOW', 0), 0o600)
try:
    deadline = time.monotonic() + 45
    while True:
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
            break
        except BlockingIOError:
            if time.monotonic() >= deadline:
                raise TimeoutError('다른 레이더가 갱신 중입니다. 잠시 후 같은 명령으로 재개해 주세요.')
            time.sleep(0.25)
    result = subprocess.run(['node', str(Path(__file__).with_name('publish.mjs')), *sys.argv[1:]], check=False)
    sys.exit(result.returncode)
finally:
    os.close(descriptor)
