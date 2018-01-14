#!/bin/sh

$HOME/bin/speedtest-cli --csv >> $HOME/logs/speedtest/$(date -u +%Y.%m.%d).log
