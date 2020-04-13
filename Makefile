SERVICE_NAME=flexit_web
SSH_SERVER=smart

test::
	go test ./...
build::
	GOOS=linux GOARCH=arm GOARM=6 go build -o $(SERVICE_NAME)
deploy:: build
	@tar czf - $(SERVICE_NAME) html/ | ssh $(SSH_SERVER) "$$DEPLOY_CMD"
setup::
	echo "$$SERVICE_FILE" | ssh $(SSH_SERVER) "$$SETUP_CMD"

define DEPLOY_CMD
echo ≫ Backing up old executable...\
	&& test -f /srv/$(SERVICE_NAME)/$(SERVICE_NAME)\
	&& mv /srv/$(SERVICE_NAME)/$(SERVICE_NAME){,.old}\
	&& echo ≫ Extracting into /srv/$(SERVICE_NAME)/...\
	;  tar xzf - -C /srv/$(SERVICE_NAME)/\
	&& echo ≫ Restarting service...\
	&& sudo service $(SERVICE_NAME) restart\
	&& echo ≫ Checking status...\
	&& sudo service $(SERVICE_NAME) status\
	&& echo ≫ Done
endef
export DEPLOY_CMD

define SETUP_CMD
echo Making directory \
	&& sudo mkdir -p /srv/$(SERVICE_NAME)/ \
	&& echo ≫ Setting folder permissions \
	&& sudo chown $$USER -R /srv/$(SERVICE_NAME)/ \
	&& echo ≫ Creating service file \
	&& cat > /srv/$(SERVICE_NAME)/$(SERVICE_NAME).service \
	&& echo ≫ Enabling service \
	&& sudo sudo systemctl enable /srv/$(SERVICE_NAME)/$(SERVICE_NAME).service \
	&& sudo systemctl daemon-reload
endef
export SETUP_CMD

define SERVICE_FILE
[Unit]
Description=$(SERVICE_NAME)

[Service]
Type=simple
WorkingDirectory=/srv/$(SERVICE_NAME)/
ExecStart=/srv/$(SERVICE_NAME)/$(SERVICE_NAME) -s /dev/ttyUSB.RS485
Restart=always
RestartSec=90
StartLimitInterval=400
StartLimitBurst=3

[Install]
WantedBy=multi-user.target

endef
export SERVICE_FILE
