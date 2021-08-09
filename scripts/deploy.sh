#!/bin/bash

############################## DEPECRATED ##############################

rm -rf node_modules/
rm -rf build/

nvm use v14
npm install

npm run build

ssh -o StrictHostKeyChecking=no -l root "$SERVER_IP" <<ENDSSH
cd /srv/apps/pouch-app
rm -rf build/
exit
ENDSSH

scp -o StrictHostKeyChecking=no -r build/ root@"$SERVER_IP":/srv/apps/pouch-app/
