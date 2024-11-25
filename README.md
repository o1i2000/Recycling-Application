GITHUB REPOSITORY:
https://github.com/o1i2000/recycling

INSTALLATION INSTRUCTIONS:

DEBUG BUILD APP:
-   DOWNLOAD THE .APK FILE SUBMISSON INTO AN ANDROID DEVICE/EMULATOR
-   INSTALL THE APPLICATION AS YOU NORMALLY WOULD DIRECLTY FROM THE .APK FILE, YOU MAY NEED TO ALLOW PERMISSIONS FOR INSTALLATION SOURCED
    OUTSIDE OF APPSTORE/GOOGLE PLAYSTORE
-   APP READY TO USE ON YOUR DEVICE

**OR**

FROM THE SOURCE/DEVELOPMENT BUILD/CODE:
-   CREATE A LOCAL CLONE OF OUR GITHUB REPOSITORY
-   MAKE SURE YOU HAVE THE DEVELOPMENT ENVIRONMENT SETUP INCLUDING DEPENDENCIES
    -   NODE, JDK/JRE, AN EMULATOR/PHYSICAL DEVICE TO RUN THE APP
    -   FOLLOW INSTRUCTIONS ON THE REACT NATIVE DEVELOPMENT SETUP PAGE https://reactnative.dev/docs/environment-setup
-   OPEN COMMAND LINE FROM THE PROJECT'S ROOT FOLDER AND RUN THE FOLLOWING COMMANDS TO INSTALL MODULE DEPENDENCIES AND LINK FILES
    -   npm install
    -   npx react-native-asset
-   RUN THE FOLLOWING COMMANDS TO START THE METRO SERVER AND INSTALL THE APP ONTO EMULATOR/DEVICE (MAKE SURE TO HAVE VIRTUAL/PHYSICAL DEVICE ACTIVE/PLUGGED IN)
    -   npm start
    -   press 'a' after the setup finishes, or run 'npm run android' in a different terminal
    -   some issues may arise on a physical device with a usb cable during installation if you have restrictions for downloads outside the appstore/unknown sources. Please grant the appropriate permissions/enable developer options on your device.
-   THE APP SHOULD NOW BE READY TO USE IN A DEVELOPMENT VIEW
