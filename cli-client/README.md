# CLI client

Ενδεικτικά περιεχόμενα:

- Command line interface (CLI).
- CLI functional tests.
- CLI unit tests.

In order to use the CLI client app for the first time make sure to run npm install and also add the absolute path of the bin directory in your User variables in your units Environment variables in order to be able to use the app universally on your unit:
..\AppData\Roaming\npm\node_modules\cli-client\bin
The CLI client is called using the structure 
                                               se2313 -s scope -p1(param 1) -p2(param 2)
After making these modification one should be able to execute CLI commands from any cmd on your device.

In order to run the functional test script for the  CLI client one has to navigate to the /cli-client directory inside the project structure and run npm test.