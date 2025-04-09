# 🚀 Getting started

Protofy is an Open Source Platform designed to automate the control of physical devices and machines using a Large Language Model (LLM) running in a continuous decision loop.

An automatic control loop reads sensor states, evaluates rules, and sends a structured prompt to the LLM to decide which actuators, if any, should be triggered. The system provides a full UI for device onboarding, rule configuration, and real-time monitoring

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

Once the system is running you can go to `http://localhost:8000` to see the web app. The first run can take some time (1-2 minutes), because it compiles the site for the first time.
*Reminder: If you have problems accessing the services, remember to check your firewall configuration.*

## 🙋‍♂️ Adding a user
The first time you run the starter you won't have users. You can easily create one on `http://localhost:8000/auth/login` but this one will be a normal user. If you want to create an admin user you can do it by running the following command:

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
