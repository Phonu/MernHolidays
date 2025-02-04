TypeError: Unknown file extension ".ts" for
Soln: npx tsc --init

used THUNDER CLIENT extention for postman services

Below script used for the code to deploy on server;
"build": "npm install && npx tsc",
"start": "node ./dist/index.js"

it will build backend server and push the code dist as server understand js code only.
Convert tsx to js
./dist/index.js will be entry point for server.

Pending TASKS: 4.22.00 - 4.45.00

1. Bundle both frontend and Backend on same server
2. Deploy code on Render.com
3. Apply Mongo network security.
