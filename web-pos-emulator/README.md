## About

This web app (POS emulator) is built with **open-wc starter** project.


## Quickstart

You can run the project on your host either with npm or with docker.


### Run project with npm

(requires node 10 & npm 6 or higher).

```bash
cd <project-folder>
cd web-pos-emulator
npm run start:build
```

Open url: http://localhost:8000 in browser.


### Run as a docker container

```bash
cd <project-folder>
cd web-pos-emulator
docker build -t wpe .
docker run -d --name mywpe -p 8001:8000 wpe
```

Open url: http://localhost:8001 in browser.


## Configuration of API path

web-pos-emulator/src/components/wpe-customer/config.js


## Scripts to develop

You can run npm with some other commands (npm run <command>):

- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Web Test Runner
- `lint` runs the linter for your project
- `prod` runs built version

