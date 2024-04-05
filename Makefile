export DOCKER_BUILDKIT=1
DOCKER_HUB_USERNAME=karlgustav
SERVICE_NAME=flexit_web
CONTAINER_NAME=docker.io/$(DOCKER_HUB_USERNAME)/$(SERVICE_NAME)

run: build
	docker run -p 8080:8080 $(CONTAINER_NAME)
build:
	docker build -t $(CONTAINER_NAME) .
push: build
	docker push $(CONTAINER_NAME)
test:
	go test ./...

export SERVICE_FILE
