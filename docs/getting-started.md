# 🚀 Getting started

Protofy is an OpenSource Web and App Framework, CMS and IoT system all in a single and integrated stack.

Based on React, NextJS, Expo, Tamagui, EspHome, protofy provides a quick and highly extensible system to quickly build digital systems using mainly javascript/typescript, visual editors, automatic cruds and control panels, an object system with validation and automatic forms, and an integrated ChatGPT assitant with automatic context transfer.

Protofy is at the same time: 

- A framework to develop webs, native mobile apps, and IoT systems
- A control panel system to extend and modify the underlying framework

We like to think of prototype as a CMS + Framework + Framework UI

## 🏃‍♂️ Run the project 

You can run the project using your local environment or using docker.

Start clonning the project:

```
git clone https://github.com/Protofy-xyz/Protofy.git
cd Protofy
```

### Docker

To run the project using docker (no node or npm needed) just run:

```
cd docker
./start-dev
```

if you want to run it in background mode, use:

```
cd docker
./dev
```

To compile protofy in production mode using docker:

```
cd docker
./web-build
./start-prod
```

### local environment: 

To run Protofy in your local envioronment, you'll need node 18 or higher and yarn to run the project. 

If you don't have yarn installed globally, you may need to do (first time only):

```
npm i -g yarn
```

Start protofy in development mode (hot reload)

```sh
yarn && yarn dev
```

## Access the system

By default there is a proxy running on port `8080` that redirects to the **next.js** app on port `3000` and the **api** on port `3001` and the **admin-api** on port `3002`. You can go to `apps/proxy/index.js` to change defaults or add more services like the expo app.

Once the Next.js app is running you can go to `http://localhost:8080` to see the web app. 

## 🙋‍♂️ Adding a user
The first time you run the starter you won't have users. You can easily create one on `http://localhost:8080/auth/login` but this one will be a normal user. If you want to create an admin user you can do it by running the following command:

```sh
yarn add-user user@email.com password admin
```

Or if you started with docker: 

```
cd docker
./add-user
```

We just created a user with `admin` type.
The admin panel requires to have a user with `admin` type to be able to access it.

Normal users can register through the interface, or you can create user accounts (whout admin panel access):

```sh
yarn add-user user@email.com password user
```

Or if you started with docker: 

```
cd docker
./add-user
```

## 🔨 Workspace
Once you've logged in you will be able to access the workspace. The workspace (or admin panel) is the place where you can create and manage your system entities, like pages, apis, devices, users, objects, etc...

Want to know more about the workspace? Check the [workspace](workspace.md) documentation.

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

🚨 Remember to run the ```yarn```  at the root of your project after installing any package. This is necessary because we need to update the dependencies of the entire monorepo when installing them.
