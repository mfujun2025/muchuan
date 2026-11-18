# -*- coding: utf-8 -*-
"""木船.cn · Git Data API 部署脚本（github.com 直推不通时的绕行方案）
参照 deploy_anquanmao_api.py：读远程 main HEAD 为 base_tree，
本地工作区相对远程 HEAD 的全部差异 → 新 tree → 新 commit → 更新 ref。
token 从 C:/Users/Huawei/.git-credentials 读取。
"""
import json
import os
import re
import ssl
import subprocess
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

REPO_DIR = Path("D:/.workbuddy/2026-10-11-08-17-39/muchuan-site")
OWNER = "mfujun2025"
REPO = "muchuan"
BRANCH = "main"
API = f"https://api.github.com/repos/{OWNER}/{REPO}"
CTX = ssl.create_default_context()
COMMIT_MSG = "feat(content): 新增 1 篇木船 SEO 文章（A83 木船双船并靠过驳怎么操作：系缆、靠把与过驳次序的老办法）"


def get_token() -> str:
    cred = Path("C:/Users/Huawei/.git-credentials")
    text = cred.read_text(encoding="utf-8")
    for line in text.splitlines():
        m = re.match(r"https://mfujun2025:([^@]+)@github\.com", line.strip())
        if m:
            return m.group(1)
    return ""


def req(method, path, payload=None):
    url = API + path if path.startswith("/") else path
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "muchuan-deploy",
        "Content-Type": "application/json",
    }
    r = urllib.request.Request(url, data=data, method=method, headers=headers)
    with urllib.request.urlopen(r, timeout=120, context=CTX) as resp:
        raw = resp.read().decode("utf-8")
        return json.loads(raw) if raw else {}


def skip(path: str) -> bool:
    p = path.replace("\\", "/")
    if p.startswith(".workbuddy") or p.startswith(".gcmtmp"):
        return True
    if p.endswith(".pyc") or "__pycache__" in p:
        return True
    return False


def collect_changes(remote_sha):
    changes = {}
    proc = subprocess.run(
        ["git", "-C", str(REPO_DIR), "diff", "--name-status", remote_sha],
        capture_output=True, text=True, timeout=60,
    )
    for line in proc.stdout.splitlines():
        if not line.strip():
            continue
        parts = line.split("\t")
        changes[parts[-1].strip()] = parts[0]

    proc2 = subprocess.run(
        ["git", "-C", str(REPO_DIR), "ls-files", "--others", "--exclude-standard"],
        capture_output=True, text=True, timeout=60,
    )
    for line in proc2.stdout.splitlines():
        path = line.strip()
        if path and not skip(path):
            changes.setdefault(path, "A")

    result = []
    for path in changes:
        src = REPO_DIR / path
        if src.exists() and src.is_file():
            result.append((src, path))
    return result


TOKEN = get_token()
assert TOKEN, "no token"

ref = req("GET", f"/git/ref/heads/{BRANCH}")
base_sha = ref["object"]["sha"]
base_tree = req("GET", f"/git/commits/{base_sha}")["tree"]["sha"]
print(f"remote HEAD: {base_sha[:8]}")

changes = collect_changes(base_sha)
print(f"changed files: {len(changes)}")

tree = []
for src, rel in changes:
    tree.append({
        "path": rel.replace("\\", "/"),
        "mode": "100644",
        "type": "blob",
        "content": src.read_text(encoding="utf-8"),  # 原文存储，严禁 base64
    })

new_tree = req("POST", "/git/trees", {"base_tree": base_tree, "tree": tree})
commit = req("POST", "/git/commits", {
    "message": COMMIT_MSG,
    "tree": new_tree["sha"],
    "parents": [base_sha],
})
result = req("PATCH", f"/git/refs/heads/{BRANCH}", {"sha": commit["sha"], "force": False})
print(f"pushed: {commit['sha'][:8]}  -> {result['object']['sha'][:8]}")
print(f"files: {[p for _, p in changes][:5]} ... total {len(changes)}")
