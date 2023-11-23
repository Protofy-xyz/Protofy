# 🚀 Getting started
The project has many features and artisanal technologies included in this starter. Let's take a look to the main ones and how to start using them.

### Cascading prompt system for LLM context management
Our tool is supercharged with AI offering the following advantages.
**Code Debugging and Assistance:** Get context-aware help in debugging and understanding complex code.
**Project-Specific Guidance:** Receive advice and suggestions tailored to your current project's context.
**Learning and Development:** Utilize the LLM’s context-aware responses for learning new programming concepts relevant to your work.

### VisualUI
[WSIWYG](https://es.wikipedia.org/wiki/WYSIWYG) editor for react. You can find it on `packages/visualui`. It's a technology that you can use to edit your react components. It's used by the admin panel to edit custom pages.

### Protoflow
Lowcode system for Javascript/Typescript code manipulation, editing and visualization. You can find it on `packages/protoflow`. It's used to edit the logic and behaviours of your program. 

## 🏃‍♂️ Run the project 
We need node 18 or higher and yarn to run the project. 

```
npm i -g yarn
```

Using the latest version (recommended until stabilization):
```sh
node prepare.js --latest
yarn && yarn dev-latest
```

Using a freezed version: 
```sh
node prepare.js
yarn && yarn dev
```

- `node prepare.js` to initialize submodules (protoflow, protolib and visualui). Only needed the first time.
- Install dependencies: `yarn`
- local dev: `yarn dev`

By default there is a proxy running on port `8080` that redirects to the **next.js** app on port `3000` and the **api** on port `3001` and the **admin-api** on port `3002`. You can go to `apps/proxy/index.js` to change defaults or add more services like the expo app.

Once the Next.js app is running you can go to `http://localhost:8080` to see the web app. 

## 🙋‍♂️ Adding a user
The first time you run the starter you won't have users. You can easily create one on `http://localhost:8080/auth/login` but this one will be a normal user. If you want to create an admin user you can do it by running the following command:

```sh
yarn add-user user@email.com password admin
```
We just created a user with `admin` type, but this is only a plain text user type identifier. You can create as many user types as you want while creating the users. 

The admin panel requires to have a user with `admin` type to be able to access it.

## 🔨 Workspace
Once you've logged in you will be able to access the workspace. The workspace (or admin panel) is the place where you can create and manage your pages, apis, devices, etc. 

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