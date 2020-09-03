#!/bin/bash
NODE_ENV=production

./stop.sh
echo -e "Starting Express \n";

NODE_ENV=$NODE_ENV node $(pwd)/dist/server.js & echo $! > express.pid
