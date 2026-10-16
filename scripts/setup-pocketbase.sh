#!/usr/bin/env bash
# Downloads the PocketBase binary matching this machine's architecture into ./pocketbase
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/pocketbase"

# Version priority: PB_VERSION env var > PB_VERSION in .env
VERSION="${PB_VERSION:-}"
if [ -z "$VERSION" ] && [ -f "$ROOT/.env" ]; then
  VERSION="$(grep -E '^PB_VERSION=' "$ROOT/.env" | tail -n1 | cut -d= -f2- | tr -d '"'"'"' \r')"
fi
if [ -z "$VERSION" ]; then
  echo "PB_VERSION is not set (define it in .env or the environment)" >&2
  exit 1
fi

case "$(uname -m)" in
  x86_64)  ARCH=amd64 ;;
  aarch64|arm64) ARCH=arm64 ;;
  armv7l)  ARCH=armv7 ;;
  *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

if [ -x "$DEST/pocketbase" ] && "$DEST/pocketbase" --version 2>/dev/null | grep -q "$VERSION"; then
  echo "PocketBase $VERSION already installed"
  exit 0
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

curl -fL -o "$TMP/pb.zip" "https://github.com/pocketbase/pocketbase/releases/download/v${VERSION}/pocketbase_${VERSION}_linux_${ARCH}.zip"
unzip -o "$TMP/pb.zip" pocketbase -d "$DEST"
chmod +x "$DEST/pocketbase"
echo "Installed PocketBase $VERSION (linux_$ARCH)"
