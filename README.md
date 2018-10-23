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

## Dev prerequisites

- python 2.7
- C compiler
- libssl-dev
- libgconf-2-4
- nodejs 10
- yarn (optional)

## To Use

- Install dependencies and rebuild node modules 
    ```npm run yarn_install```
- Create src/env_config.ts, adjust it as in src/example.env_config.ts and compile to js
- Run app 
```npm start```

## Dealing with Controllers

To run controllers you must use **ControllerRegister**'s methods:

 - **queue_controller** - to push controller's function to queue, so async events become sync.
 - **run_controller** - to simply run controller's function async.
