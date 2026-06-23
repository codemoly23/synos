#!/bin/bash
set -a
source /home/ubuntu/synos/.env.local
set +a
exec node /home/ubuntu/synos/.next/standalone/server.js
