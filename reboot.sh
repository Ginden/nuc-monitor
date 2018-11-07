#!/usr/bin/env bash

APP_NAME=$(jq -r .name package.json)
sudo systemctl stop $APP_NAME

sudo systemctl daemon-reload

sudo systemctl start $APP_NAME

