# 🚀 Getting started

Protofy is an OpenSource Web and App Framework, CMS and IoT system all in a single and integrated stack.

Based on React, NextJS, Expo, Tamagui, EspHome, protofy provides a quick and highly extensible system to quickly build digital systems using mainly javascript/typescript, visual editors, automatic cruds and control panels, an object system with validation and automatic forms, and an integrated ChatGPT assitant with automatic context transfer.

Protofy is at the same time: 

- A framework to develop webs, native mobile apps, and IoT systems
- A control panel system to extend and modify the underlying framework

We like to think of prototype as a CMS + Framework + Framework UI

## Minimum requirements
- Windows 11, Ubuntu 20.04 or MacOS Big Sur
- Node.js v18
- Python 3.10
- RAM 8 GB
- Intel® Celeron® J4125 2.00 GHz

## 🏃‍♂️ Run the project 

Start clonning the project:

```
git clone https://github.com/Protofy-xyz/Protofy.git
cd Protofy
```

If you don't have yarn installed globally, you may need to do (first time only):

```
npm i -g yarn
```

Start protofy:

```sh
yarn && yarn start
```

## Access the system

Once the system is running you can go to `http://localhost:8080` to see the web app. The first run can take some time (1-2 minutes), because it compiles the site for the first time.


*Reminder: If you have problems accessing the services, remember to check your firewall configuration.*

## 🙋‍♂️ Adding a user
The first time you run the starter you won't have users. You can easily create one on `http://localhost:8080/auth/login` but this one will be a normal user. If you want to create an admin user you can do it by running the following command:

```sh
yarn add-user user@email.com password admin
```

We just created a user with `admin` type.
The admin panel requires to have a user with `admin` type to be able to access it.

Normal users can register through the interface, or you can create user accounts (whout admin panel access):

```sh
yarn add-user user@email.com password user
```

## 🔨 Workspace
Once you've logged in you will be able to access the workspace. The workspace (or admin panel) is the place where you can create and manage your system entities, like pages, apis, devices, users, objects, etc...

Want to know more about the workspace? Check the [workspace](workspace.md) documentation.