#! /bin/bash
set -e

SERVER=${1:-screen}

CMD='
tar xzf - -C /tmp/ \
 && echo Making directory \
 && sudo mkdir -p /srv/flexit_web/ \
 && echo Copying service \
 && sudo cp /tmp/flexit_web.service /srv/flexit_web/ \
 && echo Enabling service \
 && sudo systemctl enable /srv/flexit_web/flexit_web.service \
'

echo 'Running command on "'${SERVER}'":' $CMD
tar czf - flexit_web.service |ssh $SERVER $CMD
