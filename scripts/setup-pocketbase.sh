#!/usr/bin/env bash
# Downloads the PocketBase binary matching this machine's architecture into ./pocketbase
set -euo pipefail

VERSION="${PB_VERSION:-0.30.0}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/pocketbase"

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
