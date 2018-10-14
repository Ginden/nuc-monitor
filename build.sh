#!/usr/bin/env bash

(yarn || npm install);

(cd frontend && (yarn || npm install) && (yarn build || npm run build));

PACKAGE=$(./build-systemd.js)
APP_NAME=$(jq -r .name package.json)

id -u $APP_NAME &>/dev/null || sudo useradd $APP_NAME;

sudo groupadd $APP_NAME || true;

sudo /bin/cp $PACKAGE /etc/systemd/system;

sudo systemctl stop $APP_NAME

sudo systemctl daemon-reload

sudo systemctl start $APP_NAME

echo "Run 'sudo systemctl enable $APP_NAME' to start application on boot";


