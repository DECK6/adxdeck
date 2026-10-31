#!/usr/bin/env python3
"""Local Terminal-only password setup. Never prints or persists the password."""
import base64
import getpass
import hashlib
import json
import os
from pathlib import Path
import sys

ITERATIONS = 600000
DEFAULT_KEY = Path.home() / '.config/dexa-dash/key.json'


def derive_key(password):
    if len(password) < 8:
        raise ValueError('비밀번호는 8자 이상 입력해 주세요.')
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, ITERATIONS, 32)
    return {'v': 1, 'kdf': {'name': 'PBKDF2', 'hash': 'SHA-256', 'iterations': ITERATIONS,
                           'salt': base64.b64encode(salt).decode('ascii')},
            'key': base64.b64encode(key).decode('ascii')}


def save_key(filename, config):
    target = Path(filename).expanduser()
    if target.exists() or target.is_symlink():
        raise FileExistsError('이미 초기화되어 있습니다. 기존 키를 덮어쓰지 않았습니다.')
    target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    if target.parent.is_symlink() or target.parent.stat().st_uid != os.getuid():
        raise PermissionError('키 폴더의 소유자와 심볼릭 링크를 확인해 주세요.')
    target.parent.chmod(0o700)
    # O_EXCL prevents another initializer from replacing an existing key.
    fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'w') as stream:
        json.dump(config, stream)
        stream.write('\n')
        stream.flush()
        os.fsync(stream.fileno())
    directory = os.open(target.parent, os.O_RDONLY)
    try:
        os.fsync(directory)
    finally:
        os.close(directory)


def main():
    if not sys.stdin.isatty():
        raise RuntimeError('실제 로컬 터미널에서 실행해 주세요. 표준입력/로그로 비밀번호를 받지 않습니다.')
    print('DEXA /dash 초기 비밀번호 설정')
    print('공모·강의처 탭 전체를 여는 비밀번호입니다. 입력한 문자는 표시되지 않습니다.')
    print('비밀번호 원문은 저장하지 않습니다. 이 Mac에 갱신용 파생 키만 보관합니다.\n')
    if DEFAULT_KEY.exists():
        raise FileExistsError('이미 초기화되어 있습니다. 기존 키를 유지합니다.')
    while True:
        password = getpass.getpass('새 비밀번호 (8자 이상): ')
        repeat = getpass.getpass('비밀번호 확인: ')
        if password != repeat:
            print('두 입력이 다릅니다. 다시 입력해 주세요.')
            continue
        if len(password) < 8:
            print('8자 이상 입력해 주세요.')
            continue
        config = derive_key(password)
        del password, repeat
        save_key(DEFAULT_KEY, config)
        print('\n초기 설정 완료. 이 창을 닫아도 됩니다.')
        break


if __name__ == '__main__':
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print('\n설정을 취소했습니다.')
        sys.exit(130)
    except Exception as error:
        print('설정 중단: ' + str(error), file=sys.stderr)
        sys.exit(1)
