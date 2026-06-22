#!/bin/bash
# Self-restarting dev server daemon
export DATABASE_URL="postgresql://neondb_owner:npg_lwxv6RFDay1E@ep-twilight-rain-abvguave.eu-west-2.aws.neon.tech/neondb?sslmode=require"
cd /home/z/my-project

while true; do
  echo "[$(date)] Starting dev server..."
  /usr/local/bin/bun /home/z/my-project/node_modules/.bin/next dev -p 3000 >> /home/z/my-project/dev.log 2>&1
  echo "[$(date)] Dev server exited with code $?. Restarting in 3s..."
  sleep 3
done
