# Moonshard client

Client for Moonshard messenger, written on [electron](https://electronjs.org/).

## Technology

Client implements MVC architecture.

We use:
 - DB - [sqlite](https://github.com/mapbox/node-sqlite3), rebuilded by [electron-rebuild](https://github.com/electron/electron-rebuild).
 - ORM - [typeorm](https://github.com/typeorm/typeorm).
 - Template engine - [pug](https://github.com/pugjs/pug).
 - Moonshard [core](https://github.com/MoonSHRD/core) to interact with 
 [xmpp](https://github.com/MoonSHRD/xmpp_server), 
 [p2p](https://github.com/libp2p/js-libp2p) and 
 [blockchain](https://github.com/loomnetwork/loom-js) 
 connections&events.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/MoonSHRD/desktop_client
# Go into the repository
cd desktop_client
# Install dependencies and rebuild sqlite3 
npm install; ./node_modules/.bin/electron-rebuild  -f -w sqlite3
# Or use npm scripts *_install
# Create src/env_config.ts, adjust and compile it
cp src/example.env_config.ts src/env_config.ts 
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Dealing with Controllers

To run controllers you must use **ControllerRegister**'s methods:

 - **queue_controller** - to push controller's function to queue, so async events become sync.
 - **run_controller** - to simply run controller's function async.
