# Protofy

AI Supercharged LowCode Platform CMS and Framework.
https://protofy.xyz/

## 🔦 About

This monorepo is a Full-Stack, batteries included Low-Code enabled web/app and IoT system with an API system and real time message.
You can use this as a base to fast prototype Apps, webs, IoT systems, automations or APIs.

Based on: Protofy (protoflow + visualui + protolib + protodevices) + Expo + Next.js + Tamagui + Solito + Express + Aedes + Redbird + Many other amazing packages

Many thanks [@natew] for creating the original starter and to [@FernandoTheRojo](https://twitter.com/fernandotherojo) for the Solito starter monorepo which the original [@natew] starter was forked from. Check out Fernando Rojo his [talk about using expo + next together at Next.js Conf 2021](https://www.youtube.com/watch?v=0lnbdRweJtA).

## 📦 Included packages
- Protoflow (LowCode interactive diagram system for Javscript and typescript)
- VisualUI (What you see is what you get for react)
- Protofy Admin Panel (Admin panel and object system)
- Express API system (With automatic CRUD creation)
- Aedes mqtt server
- Redbird http reverse proxy
- [Tamagui](https://tamagui.dev) 🪄
- [solito](https://solito.dev) for cross-platform navigation
- Expo SDK
- Next.js
- Expo Router
- Many more things!

## 🗂 Folder layout

The main apps are:

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

## 🏁 Start the app

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

## 🆕 Add new dependencies

### Pure JS dependencies

If you're installing a JavaScript-only dependency that will be used across platforms, install it in `packages/app`:

```sh
cd packages/app
yarn add date-fns
cd ../..
yarn
```

### Native dependencies

If you're installing a library with any native code, you must install it in `expo`:

```sh
cd apps/expo
yarn add react-native-reanimated
cd ..
yarn
```

## Update new dependencies

### Pure JS dependencies

```sh
yarn upgrade-interactive
```

You can also install the native library inside of `packages/app` if you want to get autoimport for that package inside of the `app` folder. However, you need to be careful and install the _exact_ same version in both packages. If the versions mismatch at all, you'll potentially get terrible bugs. This is a classic monorepo issue. I use `lerna-update-wizard` to help with this (you don't need to use Lerna to use that lib).

You may potentially want to have the native module transpiled for the next app. If you get error messages with `Cannot use import statement outside a module`, you may need to use `transpilePackages` in your `next.config.js` and add the module to the array there.
