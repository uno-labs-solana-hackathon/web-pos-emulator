## About

This web app has build with open-wc starter project.

## Quickstart

### Run from host with npm

(requires node 10 & npm 6 or higher).

```bash
cd <project-folder>
cd web-pos-emulator
npm run start:build
```

### Run from docker container

```bash
cd <project-folder>
cd web-pos-emulator
docker build -t wpe .
docker run -d --name mywpe -p 8000:8000 wpe
```

Open url: http://localhost:8000 in browser.

## Configuration of API path

web-pos-emulator/src/components/wpe-customer/config.js

## Scripts to develop

- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Web Test Runner
- `lint` runs the linter for your project
- `prod` runs built version

## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## How to start new project or update current one with open-wc

To get started:

```bash
npm init @open-wc
# requires node 10 & npm 6 or higher
```

