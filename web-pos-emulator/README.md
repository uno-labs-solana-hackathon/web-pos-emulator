## About

This web app (POS emulator) is built with **open-wc starter** project which is intended for developing web components.
Vaadin web components are also actively used.

Links:
https://open-wc.org/, 
https://vaadin.com/components/

## Quickstart

You can run the project on your host either with **npm** or with **docker**.


### Run project with npm

(_requires node 10 & npm 6 or higher_).

```bash
cd <project-folder>
cd web-pos-emulator
npm install
npm run start:build
```

Open url: http://localhost:8000 in your browser.


### Run as a docker container

```bash
cd <project-folder>
cd web-pos-emulator
docker build -t wpe .
docker run -d --name mywpe -p 8001:8000 wpe
```

Open url: http://localhost:8001 in your browser.


## Logging

Add hash ```#logging``` to the end of URL path to see some logs in the browser console.
For example, http://localhost:8001/#logging


## Configuration of API path

This application actively communicates with the **Loyalty Server** over AJAX requests.
You can change back-end API path in variable ```GLOBAL_PARAMS.getCustomerUrlPost``` of the file:

```./src/components/wpe-customer/config.js```

Please read API methods specification files in the following directory:

```./docs/```


## Scripts to develop

You can run npm with some other commands (```npm run <command>```):

- `start` runs your app for development, reloading on file changes
- `start:build` runs your app after it has been built using the build command
- `build` builds your app and outputs it in your `dist` directory
- `test` runs your test suite with Web Test Runner
- `lint` runs the linter for your project
- `prod` runs built version

