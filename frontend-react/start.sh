#!/bin/bash
NODE_ENV=production

./stop.sh
echo -e "Starting front end\n";
npm run build &> frontend.log
