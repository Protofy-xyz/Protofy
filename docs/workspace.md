# 💼 Workspace
![workspace-sections](https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/events/events-1.png)
The workspace (or admin panel) is the place where you can create and manage your pages, apis, devices, etc. This panel is a Next.js app that runs on port `3000` by default, but with our Redbird proxy runs in `8080` port.

> Remeber that you need to have a user with `admin` type to be able to access the workspace.

The workspace has two main sections: **Sidebar** and **Section Preview**.

![workspace-sections](https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/workspace/sections.png)

## 📚 Sidebar
Here you will have all the available sections to manage your project. You can add new pages, apis, devices, etc. If you feel with the sufficient knowledge you can also edit the code of the project to add new features to this sidebar. 

On this sidebar you will find the following sections:

- System
  - Users: Manage users and user types.
  - Groups: Manage groups.
  - Objects: Create domain related objects.
  - Pages: Create and manage pages.
  - Apis: Create and manage apis.
  - Events: Visualize events occurred in the system.
  - Public: Manage public files.
  - Files: Filesystem manager for the project.
  - Messages: Visualize messages arrived to the system (mqtt).
  - Resources: Create a resource for the project (Tutorial, invoice, etc).
  - Databases: Manage you project persistent state management. 

- Devices
  - Devices: Manage devices (HomeDevice 1, Protofy office iot, etc).
  - Definition: Create definitions for a board (Sound sensor, temperature sensor, etc)
  - Boards: Create boards that your devices will use (ESP32 DevKit, Arduino UNO, etc)
  - Cores: Create cores that your boards will use (Arduino, ESP32, etc)
  - Sdks: Create availables sdks for your project devices (ESPHome, Platformio). 


## 📱 Section Preview
The section preview will show you the content of the section to manage it.