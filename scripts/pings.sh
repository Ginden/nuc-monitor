cat /home/ginden/servers.txt | xargs -n 1 -P 4 /bin/ping -c 6 | ts "%T" | grep "bytes from" >> $HOME/logs/pings/$(date -u +%Y.%m.%d).log;
