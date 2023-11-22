<h3 align="center">
<image height="50" src="https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/logo-protofy.png">
</h3>

<h4 align="center">
  <a href="https://github.com/protofy-xyz/protofy/graphs/contributors">
    <img src="https://img.shields.io/github/contributors-anon/protofy-xyz/protofy?color=yellow&style=flat" alt="contributors" style="height: 20px;">
  </a>
  <a href="https://opensource.org/licenses/mit">
    <img src="https://img.shields.io/badge/mit-blue.svg?style=flat&label=license" alt="license" style="height: 20px;">
  </a>
  <a href="https://discord.gg/VpeZxMFfYW">
    <img src="https://img.shields.io/badge/discord-7289da.svg?style=flat&logo=discord" alt="discord" style="height: 20px;">
  </a>
  <a href="https://www.youtube.com/channel/UCmA8ZqKbySDRSVFPBrAAQ-g">
    <img src="https://img.shields.io/badge/youtube-d95652.svg?style=flat&logo=youtube" alt="youtube" style="height: 20px;">
  </a>
</h4>

<p align="center">AI Supercharged LowCode Platform CMS and Framework</p>

![visual-ui-gif](https://github.com/Protofy-xyz/Protofy/blob/assets/visualui-2.gif?raw=true)

Protofy starter is a monorepo is a Full-Stack, batteries included Low-Code enabled web/app and IoT system with an API system and real time message.

You can use this as a base to fast prototype Apps, webs, IoT systems, automations or APIs.
Based on: Protofy (protoflow + visualui + protolib + protodevices) + Expo + Next.js + Tamagui + Solito + Express + Aedes + Redbird + Many other amazing packages

Many thanks [@natew] for creating the original starter and to [@FernandoTheRojo](https://twitter.com/fernandotherojo) for the Solito starter monorepo which the original [@natew] starter was forked from. Check out Fernando Rojo his [talk about using expo + next together at Next.js Conf 2021](https://www.youtube.com/watch?v=0lnbdRweJtA).

## 📦 Included packages

![devices-package](https://github.com/Protofy-xyz/Protofy/blob/assets/device-1.gif?raw=true)

- `Protoflow` LowCode interactive diagram system for Javscript and typescript)
- `VisualUI` (What you see is what you get for react)
- `Protofy` Admin Panel (Admin panel and object system)
- `Express` API system (With automatic CRUD creation)
- `Aedes` mqtt server
- `Redbird` http reverse proxy
- [Tamagui](https://tamagui.dev) 🪄
- [Solito](https://solito.dev) for cross-platform navigation
- `Expo SDK`
- `Next.js`
- `Expo Router`
- `Many more things!`

## 🗂️ Folder layout
The project has two main folders: 

- `apps` 
  - `expo` (native)
  - `next` (web)
  - `api` (express API to create the web or app)
  - `admin-api` (express API with the admin API)
  - `proxy` (redbird reverse proxy)

- `packages` shared packages across apps
  - `ui` includes your custom UI kit that will be optimized by Tamagui
  - `app` you'll be importing most files from `app/`
    - `bundles`
      - `custom` the custom bundle, put here your custom pages, components, apis etc. The admin panel reads and writes on this bundle.
  - `protolib` Protofy react library with high level widgets and functions to bootstrap the web/app creation
  - `protoflow` Protofy react library to draw js/ts/jsx/tsx as diagrams
  - `visualui` Protofy react library to do WYSIWYG in react
  - `protodevice` Protofy integration with ESPHome for IoT and device management

You can add other folders inside of `packages/` if you know what you're doing and have a good reason to.

## 🚀 Getting started
Using a freezed version: 

```sh
node prepare.js
yarn && yarn dev
```

Using the latest version (recommended until stabilization):

```sh
node prepare.js --latest
yarn && yarn dev-latest
```

- `node prepare.js` to initialize submodules (protoflow, protolib and visualui). Only needed the first time.
- Install dependencies: `yarn`
- local dev: `yarn dev`

By default there is a proxy running on port 8080 that redirects to the next.js app on port 3000 and the api on port 3001 and the adminApi on port 3002. You can go to `apps/proxy/index.js` to change defaults or add more services like the expo app.

Once the nextjs app is running you can go to `http://localhost:8080` to see the web app. 

## 🙋‍♂️ Adding a user
The first time you run the starter you won't have users. You can easily create one on `http://localhost:8080/auth/login` but this one will be a normal user. If you want to create an admin user you can do it by running the following command:

```sh
yarn add-user user@email.com password admin
```
We just created a user with `admin` type, but this is only a plain text user type identifier. You can create as many user types as you want while creating the users. 

The admin panel requires to have a user with `admin` type to be able to access it.

## 🆕 Add new dependencies

### · Pure JS dependencies

If you're installing a JavaScript-only dependency that will be used across platforms, install it in `packages/app`:

```sh
cd packages/app
yarn add date-fns
cd ../..
yarn
```

### ·  Native dependencies

If you're installing a library with any native code, you must install it in `expo`:

```sh
cd apps/expo
yarn add react-native-reanimated
cd ..
yarn
```

## ☝️ Update new dependencies

### · Pure JS dependencies

```sh
yarn upgrade-interactive
```

You can also install the native library inside of `packages/app` if you want to get autoimport for that package inside of the `app` folder. However, you need to be careful and install the _exact_ same version in both packages. If the versions mismatch at all, you'll potentially get terrible bugs. This is a classic monorepo issue. I use `lerna-update-wizard` to help with this (you don't need to use Lerna to use that lib).

You may potentially want to have the native module transpiled for the next app. If you get error messages with `Cannot use import statement outside a module`, you may need to use `transpilePackages` in your `next.config.js` and add the module to the array there.
