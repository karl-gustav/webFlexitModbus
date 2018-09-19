#! /bin/bash

scp -r dist/* smart:/srv/flexit_web/ \
    && ssh smart 'mv /srv/flexit_web/flexit_web{,.old} ; mv /srv/flexit_web/flexit_web{.new,} && service flexit_web restart'
