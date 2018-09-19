Set up ssh alias "smart" (with no pass on ssh key) in ~/.ssh/config

Run "./setup.sh"

Run "./build.sh && ./deploy.sh"

If you have another name for the server in ssh/config you can put that after the deploy script,
i.e. `./build.sh && ./deploy.sh <my server name>`

PS: This project uses git submodules for it's go