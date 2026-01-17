#!/bin/sh
set -e

# Ensure uploads directory exists and is writable by nextjs user (uid 1001)
mkdir -p /app/uploads

# Try to chown the uploads directory to nextjs:nodejs (uid/gid 1001)
# This will succeed when container runs as root (typical for entrypoint)
if [ -w / ]; then
  chown -R 1001:1001 /app/uploads || true
fi

# If first arg looks like an option, prepend the default command
# Finally drop privileges and exec the passed command as nextjs
exec su-exec 1001:1001 "$@"
