Purpose
=======
This app uses the https://github.com/karl-gustav/flexitModbus library to talk to a flexit
ventilation system over Modbus (RS485 serial USB interface) and exposes that as a web API

Preconditions
=============
Set up ssh alias "smart" (with no pass on ssh key) in ~/.ssh/config or change SSH_SERVER
in the Makefile

Setup
=====
Run `make setup` to do the first time setup to create the folders and setup the service.

Deploy
======
Run `make deploy` to deploy the executable to the server
