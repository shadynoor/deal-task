# Task Documentation

### Table of Contents

| No. | Content                                 |
| --- | --------------------------------------- |
| 1   | [Technologies Used](#technologies-used) |
| 2   | [Installation](#installation)           |
| 3   | [Folder Structure](#folder-structure)   |
| 4   | [Librabies](#librabies)                 |

1. ### Technologies Used

App built using Angular-Ionic using Capacitor and recordRtc

2. ### Installation

To try the app:

    1.  clone the repo
    2.  install packages using `npm install --legacy-peer-deps`
    3.  run `ionic serve` and then navigate to `http://localhost:8100/`
    4.  Check Notes in Docs Tab for build

3.  ### Folder Structure

    Hala Meet Landing Page Contains 3 Folders

    1. #### Core

       This Folder contains core services across the application and helpers functions including:

       i. Network Service: this service is responsible for checking whether network is working or not.
       ii. Photo Service: this service is responsible for everything about user photo.
       iii. helpers.ts: contains a method that convert blob to base64 to be stored in local storage

    2. #### Components

       This Folder contains Tabs Components

       i. Tab1 Component: For Documentation and Notes
       ii. Tab2 Component: For the Form
       iii. Tab3 Component: For displaying history of the user
       iv. Tabs Component: For Tabs Bar
       v. Recorder Component: For Voice Recorder

    **[⬆ Back to Top](#table-of-contents)**

4.  ### Librabies

    1. **Capacitor**
    2. **RecordRtc**

    **[⬆ Back to Top](#table-of-contents)**
