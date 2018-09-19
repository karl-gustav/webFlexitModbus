Init:

Set up ssh alias "smart" (with no pass on ssh key)

Run this on server:

    mkdir -p /srv/flexit_web/

Start by installing it as a service in a system that has systemd
installed:

    systemctl enable /srv/flexit_web/flexit_web.service

And start the service:

    systemctl start flexit_web

And check the logs that everything went ok:

    journalctl -u flexit_web # add -f to continuously print new entries