# dmanage
![Version](https://img.shields.io/badge/Version-0.5.0-blue.svg)  
A simple GUI for docker made in node-webkit, or nw.js.

## Features
- [x] Dashboard containing info about base images, and containers
- [x] Container overview with stop/start/remove functionality
- [x] View/run/delete base images
- [x] Create base images from Dockerfiles
- [ ] Integrated Docker Hub
- [ ] HTTP and Unix connection with Docker

### Dashboard
![Dashboard](common/images/interface/dashboard.png?raw=true)
### Containers
![Containers](common/images/interface/containers.png?raw=true)
### Base images
![Base images](common/images/interface/base-images.png?raw=true)
### Build images
![Build images](common/images/interface/build-image.png?raw=true)
### Settings
![Settings](common/images/interface/settings.png?raw=true)

## Running this project
Get [nw.js](https://github.com/nwjs/nw.js) and run it using `/path/to/nw /path/to/this/folder`.
For example `/home/me/nwjs/nw /home/me/projects/dmanage`.

### Dependencies
This project has dependencies on node modules, run the command `npm install` in the root folder of
the project to install them.

Dependencies:

- tar-fs
- request

## Contributing
If you spot a bug, want to add a feature, or something else you can help this project become better
and more user friendly, please open an issue, fork the project, and then create a pull request from
your fork.  
I will do my best to review it ASAP and merge it if it LGTM.
