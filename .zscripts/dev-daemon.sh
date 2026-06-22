#!/bin/bash
# Persistent dev server daemon — restarts if it dies
export DATABASE_URL="postgresql://neondb_owner:npg_lwxv6RFDay1E@ep-twilight-rain-abvguave.eu-west-2.aws.neon.tech/neondb?sslmode=require"
cd /home/z/my-project

while true; do
  echo "[$(date)] Starting dev server (PID $$)..." >> /home/z/my-project/dev-daemon.log
  /usr/local/bin/bun /home/z/my-project/node_modules/.bin/next dev -p 3000 --webpack >> /home/z/my-project/dev.log 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Dev server exited with code $EXIT_CODE. Restarting in 5s..." >> /home/z/my-project/dev-daemon.log
  sleep 5
done
